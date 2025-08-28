/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class GetService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
}
