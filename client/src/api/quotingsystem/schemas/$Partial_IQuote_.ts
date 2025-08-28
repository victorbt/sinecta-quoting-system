/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Partial_IQuote_ = {
    description: `Make all properties in T optional`,
    properties: {
        id: {
            type: 'number',
            format: 'double',
        },
        clientName: {
            type: 'string',
        },
        crop: {
            type: '_36_Enums_Crop',
        },
        state: {
            type: '_36_Enums_MxState',
        },
        areaHa: {
            type: 'number',
            format: 'double',
        },
        insuredAmount: {
            type: 'number',
            format: 'double',
        },
        validFrom: {
            type: 'string',
            format: 'date-time',
        },
        validTo: {
            type: 'string',
            format: 'date-time',
        },
        polygon: {
            properties: {
            },
        },
        ownerId: {
            type: 'number',
            format: 'double',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
