import { Inject } from 'typescript-ioc';
import { Body, Get, Path, Post, Query, Route, Security, SuccessResponse, Tags, Response, Controller } from 'tsoa';
import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify';
import { CreateQuoteSchema, ListQuerySchema } from '../../domain/schemas/quote';
import { QuotesService } from '../../services/quotes/quotes.service';
import type { Response as ExResponse } from 'express';

const sanitizeCsvCell = (val: any) => {
  const s = String(val ?? '');
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
};

@Route('quotes')
@Tags('Quotes')
export class QuotesController extends Controller {
  @Inject private svc: QuotesService

  @Post()
  @Security('jwt')
  @SuccessResponse(201, 'Created')
  @Response<{ code: string, message: string }>(422, 'Validation error')
  public async create(@Body() body: unknown) {
    const parsed = CreateQuoteSchema.parse(body);
    // @ts-ignore
    const ownerId = (this as any).request.user.sub;
    const created = await this.svc.create(ownerId, parsed);
    return created;
  }

  @Get()
  @Security('jwt')
  public async list(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() crop?: string,
    @Query() state?: string,
    @Query() q?: string,
  ) {
    const parsed = ListQuerySchema.parse({ page, pageSize, crop, state, q });
    return this.svc.list(parsed);
  }

  @Get('{id}')
  @Security('jwt')
  public async get(@Path() id: number) {
    const q = await this.svc.get(Number(id));
    if (!q) return { message: 'Not found' };
    return q;
  }

  @Get('export.csv')
  @Security('jwt')
  public async exportCSV(): Promise<void> {
    // @ts-ignore
    const res: ExResponse = (this as any).response;
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
  }

  @Get('export.pdf')
  @Security('jwt')
  public async exportPDF(): Promise<void> {
    // @ts-ignore
    const res: ExResponse = (this as any).response;
    const { prisma } = await import('../../database/prisma/client');
    const rows = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } });

    const doc = new PDFDocument({ margin: 36, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="quotes.pdf"');
    doc.pipe(res);
    doc.fontSize(16).text('Quotes Report', { align: 'center' });
    doc.moveDown();
    rows.forEach((r: any) => {
      doc.fontSize(11).text(`${r.id} - ${r.clientName} - ${r.crop} - ${r.state} - ${r.areaHa} ha - $${r.insuredAmount}`);
    });
    doc.end();
  }
}
