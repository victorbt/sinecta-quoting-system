/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
        requestBody: any,
    ): CancelablePromise<Quote> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/quotes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation error`,
            },
        });
    }
    /**
     * @param page
     * @param pageSize
     * @param crop
     * @param state
     * @param q
     * @returns any Ok
     * @throws ApiError
     */
    public list(
        page?: number,
        pageSize?: number,
        crop?: string,
        state?: string,
        q?: string,
    ): CancelablePromise<{
        data: Array<Quote>;
        pageSize: number;
        page: number;
        total: number;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/quotes',
            query: {
                'page': page,
                'pageSize': pageSize,
                'crop': crop,
                'state': state,
                'q': q,
            },
        });
    }
    /**
     * @param id
     * @returns any Ok
     * @throws ApiError
     */
    public get(
        id: number,
    ): CancelablePromise<(Quote | {
        message: string;
    })> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/quotes/{id}',
            path: {
                'id': id,
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
            url: '/quotes/export.csv',
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public exportPdf(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/quotes/export.pdf',
        });
    }
}
