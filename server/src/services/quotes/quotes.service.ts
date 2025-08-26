import { Singleton, OnlyInstantiableByContainer, Inject } from "typescript-ioc";
import area from '@turf/area';
import { Feature, Polygon } from 'geojson';
import { Quote } from '../../domain/models/quote';
import { QuoteRepository } from '../../infrastructure/repositories/quotes/quote.repository';
import { DomainError } from '../../database/prisma/error';
import { prisma } from '../../database/prisma/client';

@Singleton
@OnlyInstantiableByContainer
export class QuotesService {
  @Inject private repo: QuoteRepository

  private computeAreaHa(polygon: any) {
    const feature: Feature<Polygon> = { type: 'Feature', properties: {}, geometry: polygon };
    return area(feature) / 10000;
  }

  async create(ownerId: number, payload: any): Promise<Quote> {
    const areaHa = this.computeAreaHa(payload.polygon);
    if (areaHa < 1 || areaHa > 1000) throw new DomainError('QUOTE_AREA_RANGE', 'Área fuera de rango (1 a 1000 ha)');
    if (areaHa > 500) console.log(`[notify] large area: ${areaHa.toFixed(2)} ha`);

    return this.repo.insertOne({
      clientName: payload.clientName,
      crop: payload.crop,
      state: payload.state,
      areaHa,
      insuredAmount: payload.insuredAmount,
      validFrom: new Date(payload.validFrom),
      validTo: new Date(payload.validTo),
      polygon: payload.polygon,
      ownerId
    } as any);
  }

  async list(params: { page: number; pageSize: number; crop?: string; state?: string; q?: string }) {
    const where: any = {};
    if (params.crop) where.crop = params.crop;
    if (params.state) where.state = params.state;
    if (params.q) where.clientName = { contains: params.q, mode: 'insensitive' };

    const skip = (params.page - 1) * params.pageSize;
    const [data, total] = await Promise.all([
      this.repo.find({ where, order: { createdAt: 'DESC' }, skip, take: params.pageSize }),
      prisma.quote.count({ where })
    ]);
    console.log(data)
    return { total, page: params.page, pageSize: params.pageSize, data };
  }

  async get(id: number) {
    const recs = await this.repo.find({ where: { id }, take: 1 });
    return recs[0] || null;
  }
}
