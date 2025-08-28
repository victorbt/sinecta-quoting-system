/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ValidateError = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
        },
        message: {
            type: 'string',
            isRequired: true,
        },
        stack: {
            type: 'string',
        },
        statusCode: {
            type: 'number',
            isRequired: true,
            format: 'double',
        },
        details: {
            type: 'any-of',
            contains: [{
                type: 'ValidationErrorDetails',
            }, {
                type: 'Record_string_any_',
            }],
        },
    },
} as const;
