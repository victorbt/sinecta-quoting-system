import { User, IUser } from '../../../domain/models/user';
import { prisma } from '../../../database/prisma/client';
import { BaseRepository, FindOptions } from '../base/base.repository';

export interface IUserRepository {
  find(options?: FindOptions<IUser>): Promise<User[]>;
  findOne(options?: FindOptions<IUser>): Promise<User | null>;
  insertOne(data: IUser): Promise<User>;
  insertMany(data: IUser[]): Promise<User[]>;
  updateOne(where: { id: number }, data: Partial<IUser>): Promise<User>;
  deleteOne(where: { id: number } | { email: string }): Promise<void>;
}
export class UserRepository extends BaseRepository<User, IUser> implements IUserRepository {
  protected readonly model = prisma.user;
  protected readonly uniqueWhere = (where: any) => 'email' in where ? { email: where.email } : { id: where.id };
}
