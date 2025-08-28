import { Request as expressReq, Response as expressRes } from "express";
import { Inject } from 'typescript-ioc';
import { StatusCodes } from 'http-status-codes';
import {
  Request,
  Body,
  Get,
  Path,
  Post,
  Put,
  Delete,
  Query,
  Route,
  Security,
  SuccessResponse,
  Tags,
  Res,
  Response,
  TsoaResponse,
  Controller
} from 'tsoa';

import { IQuote } from '../../domain/models';

import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify';
import { CreateQuoteSchema, ListQuerySchema } from '../../domain/schemas/quote';
import { QuotesService } from '../../services/quotes/quotes.service';
import { ValidateError } from '../../errors/validate.error';
import { PassThrough } from "stream";

const sanitizeCsvCell = (val: any) => {
  const s = String(val ?? '');
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
};

@Route('/api/v1/quote')
@Tags('Quotes')
export class QuotesController extends Controller {
  @Inject private svc: QuotesService

  @Post('/')
  @Tags('Post')
  @Security('jwt')
  @SuccessResponse(201, 'Created')
  @Response<ValidateError>("401", "Unauthorized", {
    name: "Unauthorized",
    message: "Validation failed",
    statusCode: 401,
    details: {},
  })
  @Response<ValidateError>("422", "Validation Failed", {
    message: "Validation failed",
    name: "Quote Schema Validation Failed",
    statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
    details: {
      "body.$0.name": {
        "message": "'clientName' is required"
      },
    }
  })
  public async create(
    @Body() body: IQuote
  ) {
    this.setStatus(StatusCodes.CREATED);
    const parsed = CreateQuoteSchema.parse(body);
    console.log(parsed)
    // @ts-ignore
    const ownerId = (this as any).request.user.id;
    const created = await this.svc.create(ownerId, parsed);
    return created;
  }

  @Put('/{id}')
  @Security('jwt', ['admin'])
  @Response<ValidateError>("401", "Unauthorized", {
    name: "Unauthorized",
    message: "Validation failed",
    statusCode: 401,
    details: {},
  })
  public async update(
    @Request() req: expressReq,
    @Path() id: number,
    @Body() body: Partial<IQuote>,
    @Res() badRequestResponse: TsoaResponse<StatusCodes.BAD_REQUEST, { error: string }>,
  ): Promise<any> {
    if (id < 0) {
      return badRequestResponse(StatusCodes.BAD_REQUEST, { error: "invalid parkingLot ID: must be greater than 0" })
    }
    const parsed = CreateQuoteSchema.parse(body);

    const updated = await this.svc.udpate(id, parsed);
    return updated;
  }


  @Get('/')
  @Tags('Get')
  @Security('jwt')
  @SuccessResponse(201, 'Created')
  @Response<ValidateError>("401", "Unauthorized", {
    name: "Unauthorized",
    message: "Validation failed",
    statusCode: 401,
    details: {},
  })
  public async list(
    @Res() badRequestResponse: TsoaResponse<StatusCodes.BAD_REQUEST, { error: string }>,
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() crop?: string,
    @Query() state?: string,
    @Query() q?: string,
  ) {
    if (page && page < 0) {
      return badRequestResponse(StatusCodes.BAD_REQUEST, { error: "invalid skip value: must be greater than 0" })
    }

    if (pageSize && pageSize < 0) {
      return badRequestResponse(StatusCodes.BAD_REQUEST, { error: "invalid limit value: must be greater than 0" })
    }

    const parsed = ListQuerySchema.parse({ page, pageSize, crop, state, q });
    return this.svc.list(parsed);
  }

  @Get('/{id}')
  @Tags('Get')
  @Security('jwt')
  @SuccessResponse(201, 'Created')
  @Response<ValidateError>("401", "Unauthorized", {
    name: "Unauthorized",
    message: "Validation failed",
    statusCode: 401,
    details: {},
  })
  public async get(
    @Path() id: number,
    @Res() badRequestResponse: TsoaResponse<StatusCodes.BAD_REQUEST, { error: string }>
  ) {
    if (id < 0) {
      return badRequestResponse(StatusCodes.BAD_REQUEST, { error: "invalid parkingLot ID: must be greater than 0" })
    }
    const q = await this.svc.get(Number(id));
    if (!q) return { message: 'Not found' };
    return q;
  }

  @Delete('{id}')
  @Security('jwt', ['ADMIN'])
  @SuccessResponse(201, 'Created')
  @Response<ValidateError>("401", "Unauthorized", {
    name: "Unauthorized",
    message: "Validation failed",
    statusCode: 401,
    details: {},
  })
  public async delete(
    @Path() id: number) {
    try {
      await this.svc.delete(Number(id));
    } catch (e: any) {
      return { message: e.message };
    }
    return null;
  }

  @Get('/export/csv')
  @Security('jwt')
  public async exportCSV(
    @Request() req: expressReq
  ): Promise<void> {
    // @ts-ignore

    console.log(req)
    const res: expressRes = req.res as any;
    const { prisma } = await import('../../database/prisma/client');
    const rows = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="quotes.csv"');

    const stringifier = stringify({ header: true, columns: ['id', 'clientName', 'crop', 'state', 'areaHa', 'insuredAmount', 'validFrom', 'validTo', 'createdAt'] });
    stringifier.pipe(res);
    rows.forEach((r: any) => stringifier.write([
      sanitizeCsvCell(r.id),
      sanitizeCsvCell(r.clientName),
      sanitizeCsvCell(r.crop),
      sanitizeCsvCell(r.state),
      sanitizeCsvCell(r.areaHa),
      sanitizeCsvCell(r.insuredAmount),
      sanitizeCsvCell(r.validFrom.toISOString()),
      sanitizeCsvCell(r.validTo.toISOString()),
      sanitizeCsvCell(r.createdAt.toISOString()),
    ]));
    stringifier.end();
    return
  }

  @Get('/export/pdf')
  @Security('jwt')
  public async exportPDF(
    @Request() req: expressReq
  ): Promise<NodeJS.ReadableStream> {
    // @ts-ignore
    const res: expressRes = req.res as any;

    let stream = new PassThrough()
    const { prisma } = await import('../../database/prisma/client');
    const rows = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } });

    const doc = new PDFDocument({ margin: 36, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="quotes.pdf"');
    doc.pipe(stream);
    doc.fontSize(16).text('Quotes Report', { align: 'center' });
    doc.moveDown();
    rows.forEach((r: any) => {
      doc.fontSize(11).text(`${r.id} - ${r.clientName} - ${r.crop} - ${r.state} - ${r.areaHa} ha - $${r.insuredAmount}`);
    });
    doc.end();
    
    return stream
  }
}
