import { Quote,IQuote } from '../../../domain/models/quote';
import { prisma } from '../../../database/prisma/client';
import { BaseRepository, FindOptions } from '../base/base.repository';


export interface IQuoteRepository {
  find(options?: FindOptions<IQuote>): Promise<Quote[]>;
  findOne(options?: FindOptions<IQuote>): Promise<Quote | null>;
  insertOne(data: IQuote): Promise<Quote>;
  insertMany(data: IQuote[]): Promise<Quote[]>;
  updateOne(where: { id: number }, data: Partial<IQuote>): Promise<Quote>;
  deleteOne(where: { id: number }): Promise<void>;
}

export class QuoteRepository extends BaseRepository<Quote, IQuote> implements IQuoteRepository {
  protected readonly model = prisma.quote;
  protected readonly uniqueWhere = (where: any) => ({ id: where.id });
}
