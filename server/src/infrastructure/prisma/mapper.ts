import { FindManyOptions } from './find-options';

export const toPrismaArgs = (options?: FindManyOptions) => {
  if (!options) return {};
  const { where, order, skip, take } = options;
  const orderBy = order
    ? Object.entries(order).map(([k, v]) => ({ [k]: v === 'DESC' ? 'desc' : 'asc' as const }))
    : undefined;

  return { where, orderBy, skip, take };
};
