import { $Enums } from '../../generated/prisma/client'

export interface IUser {
    id?: number;
    name: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date,
    updatedAt?: Date,
}

export class User implements IUser {
    constructor(
        public name: string,
        public email: string,
        public passwordHash: string,
        public role: $Enums.Role,
        public id?: number,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) { }
}