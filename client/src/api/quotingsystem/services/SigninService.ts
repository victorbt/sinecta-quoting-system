/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SigninService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param authorization
     * @returns any OK
     * @throws ApiError
     */
    public signin(
        authorization: string,
    ): CancelablePromise<{
        data: {
            refreshToken: string;
            accessToken: string;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/auth/signin',
            headers: {
                'authorization': authorization,
            },
        });
    }
}
