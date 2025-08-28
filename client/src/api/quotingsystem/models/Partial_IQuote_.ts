/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _36_Enums_Crop } from './_36_Enums_Crop';
import type { _36_Enums_MxState } from './_36_Enums_MxState';
/**
 * Make all properties in T optional
 */
export type Partial_IQuote_ = {
    id?: number;
    clientName?: string;
    crop?: _36_Enums_Crop;
    state?: _36_Enums_MxState;
    areaHa?: number;
    insuredAmount?: number;
    validFrom?: string;
    validTo?: string;
    polygon?: any;
    ownerId?: number;
    createdAt?: string;
    updatedAt?: string;
};

