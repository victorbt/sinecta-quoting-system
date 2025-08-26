export interface IApiResponse {
    success?: boolean
    message?: string
    error?: Error
    count?: number
    details?:any
    data?: any
}
