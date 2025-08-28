/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';
import { AuthService } from './services/AuthService';
import { GetService } from './services/GetService';
import { PostService } from './services/PostService';
import { QuotesService } from './services/QuotesService';
import { SigninService } from './services/SigninService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class quotingsystem {
    public readonly auth: AuthService;
    public readonly get: GetService;
    public readonly post: PostService;
    public readonly quotes: QuotesService;
    public readonly signin: SigninService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.auth = new AuthService(this.request);
        this.get = new GetService(this.request);
        this.post = new PostService(this.request);
        this.quotes = new QuotesService(this.request);
        this.signin = new SigninService(this.request);
    }
}

