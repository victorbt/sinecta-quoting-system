/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $IQuote = {
    properties: {
        id: {
            type: 'number',
            format: 'double',
        },
        clientName: {
            type: 'string',
            isRequired: true,
        },
        crop: {
            type: '_36_Enums_Crop',
            isRequired: true,
        },
        state: {
            type: '_36_Enums_MxState',
            isRequired: true,
        },
        areaHa: {
            type: 'number',
            isRequired: true,
            format: 'double',
        },
        insuredAmount: {
            type: 'number',
            isRequired: true,
            format: 'double',
        },
        validFrom: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        validTo: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        polygon: {
            properties: {
            },
            isRequired: true,
        },
        ownerId: {
            type: 'number',
            isRequired: true,
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
