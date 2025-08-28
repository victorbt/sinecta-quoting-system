import { Exception } from "./base.error";

export class ValidateError extends Error implements Exception {
    name: string
    message: string = "";
    statusCode: number = 400;
    details: ValidationErrorDetails | Record<string, any> | undefined;

    constructor(message: string, status: number, details?: ValidationErrorDetails | Record<string, any>) {
        super()
        this.message = message, this.statusCode = status, this.details = details
    }
}

interface ValidationErrorDetails {
    [name: string]: { message: unknown }
}
