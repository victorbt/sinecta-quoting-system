// src/infrastructure/repositories/base/base.repository.ts
import { mapPrismaError } from '../../../database/prisma/error';

type AnyDelegate<T> = {
  findMany(args?: any): Promise<T[]>;
  findFirst(args?: any): Promise<T | null>;
  create(args: { data: any }): Promise<T>;
  createMany?(args: { data: any[]; skipDuplicates?: boolean }): Promise<any>;
  update(args: { where: any; data: any }): Promise<T>;
  delete(args: { where: any }): Promise<T>;
};

export type FindOrder = Record<string, 'ASC' | 'DESC'>;
export type FindOptions<T = any> = {
  where?: Record<string, any>;
  order?: FindOrder;
  skip?: number;
  take?: number;
};

export abstract class BaseRepository<Props, CreateProps extends object> {
  protected abstract readonly model: AnyDelegate<Props> | any;
  protected abstract readonly uniqueWhere: (idOrWhere: any) => any;

  protected toPrismaArgs(options?: FindOptions) {
    if (!options) return {};
    const { where, order, skip, take } = options;
    const orderBy = order
      ? Object.entries(order).map(([k, v]) => ({ [k]: v === 'DESC' ? 'desc' : 'asc' as const }))
      : undefined;
    return { where, orderBy, skip, take };
  }

  async find(options?: FindOptions<Props>): Promise<Props[]> {
    try { return await this.model.findMany(this.toPrismaArgs(options)); }
    catch (e) { return mapPrismaError(e); }
  }

  async findOne(options?: FindOptions<Props>): Promise<Props | null> {
    try { return await this.model.findFirst(this.toPrismaArgs(options)); }
    catch (e) { return mapPrismaError(e); }
  }

  async insertOne(data: CreateProps): Promise<Props> {
    try { return await this.model.create({ data }); }
    catch (e) { return mapPrismaError(e); }
  }

  async insertMany(data: CreateProps[]): Promise<Props[]> {
    try {
      if (this.model.createMany) {
        await this.model.createMany({ data: data as any, skipDuplicates: true });
        return this.find();
      }
      const res: Props[] = [];
      for (const d of data) res.push(await this.model.create({ data: d }));
      return res;
    } catch (e) { return mapPrismaError(e); }
  }

  async updateOne(where: any, data: Partial<Props>): Promise<Props> {
    try { return await this.model.update({ where: this.uniqueWhere(where), data }); }
    catch (e) { return mapPrismaError(e); }
  }

  async deleteOne(where: any): Promise<void> {
    try { await this.model.delete({ where: this.uniqueWhere(where) }); }
    catch (e) { return mapPrismaError(e); }
  }
}