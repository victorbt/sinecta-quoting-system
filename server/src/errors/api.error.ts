import { Exception } from "./base.error";

export class ApiError extends Error implements Exception {
	message: string = "";
	statusCode: number = 400;
	name: string = "";

	constructor(message: string, status: number) {
		super()
		this.message = message, this.statusCode = status
	}
}
