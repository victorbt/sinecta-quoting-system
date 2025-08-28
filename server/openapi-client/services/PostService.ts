/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IQuote } from '../models/IQuote';
import type { Quote } from '../models/Quote';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PostService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param requestBody
     * @returns Quote Created
     * @throws ApiError
     */
    public create(
        requestBody: IQuote,
    ): CancelablePromise<Quote> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/quote',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                422: `Validation Failed`,
            },
        });
    }
}
