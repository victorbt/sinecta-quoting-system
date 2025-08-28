/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Record_string_any_ } from './Record_string_any_';
import type { ValidationErrorDetails } from './ValidationErrorDetails';
export type ValidateError = {
    name: string;
    message: string;
    stack?: string;
    statusCode: number;
    details?: (ValidationErrorDetails | Record_string_any_);
};

