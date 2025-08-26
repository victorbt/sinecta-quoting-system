export type OrderDirection = 'ASC' | 'DESC';

export type FindOptionsWhere<T> = Partial<{
  [K in keyof T]: T[K] | { equals?: T[K]; contains?: string; in?: T[K][] };
}> & Record<string, any>;

export type FindManyOptions<T = any> = {
  where?: FindOptionsWhere<T>;
  order?: Record<string, OrderDirection>;
  skip?: number;
  take?: number;
};

export type FindOneOptions<T = any> = FindManyOptions<T>;
