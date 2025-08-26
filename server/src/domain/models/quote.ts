import { $Enums} from '../../generated/prisma/client'

export interface IQuote {
    id?: number;
    clientName: string;
    crop: $Enums.Crop;
    state: $Enums.MxState;
    areaHa: number;
    insuredAmount: number;
    validFrom: Date;
    validTo: Date;
    polygon: unknown;
    ownerId: number;
    createdAt?: Date,
    updatedAt?: Date,
}

export class Quote implements IQuote {
    constructor(
        public clientName: string,
        public crop: $Enums.Crop,
        public state: $Enums.MxState,
        public areaHa: number,
        public insuredAmount: number,
        public validFrom: Date,
        public validTo: Date,
        public polygon: unknown,
        public ownerId: number,
        public id?: number,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) { }
}