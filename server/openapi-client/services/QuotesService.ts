/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IQuote } from '../models/IQuote';
import type { NodeJS_ReadableStream } from '../models/NodeJS_ReadableStream';
import type { Partial_IQuote_ } from '../models/Partial_IQuote_';
import type { Quote } from '../models/Quote';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class QuotesService {
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
    /**
     * @param page
     * @param pageSize
     * @param crop
     * @param state
     * @param q
     * @returns any Created
     * @throws ApiError
     */
    public list(
        page?: number,
        pageSize?: number,
        crop?: string,
        state?: string,
        q?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/quote',
            query: {
                'page': page,
                'pageSize': pageSize,
                'crop': crop,
                'state': state,
                'q': q,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public update(
        id: number,
        requestBody: Partial_IQuote_,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/quote/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * @param id
     * @returns any Created
     * @throws ApiError
     */
    public get(
        id: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/quote/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * @param id
     * @returns any Created
     * @throws ApiError
     */
    public delete(
        id: number,
    ): CancelablePromise<{
        message: any;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/quote/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public exportCsv(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/quote/export/csv',
        });
    }
    /**
     * @returns NodeJS_ReadableStream Ok
     * @throws ApiError
     */
    public exportPdf(): CancelablePromise<NodeJS_ReadableStream> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/quote/export/pdf',
        });
    }
}
