import type { HttpStatusCode } from 'axios';

export class ValidationError extends Error {}
export class RaindropError extends Error {}

/**
 * Common error responses from Raindrop API.
 *
 * NOTE: response comes with 200 OK
 */
export type ErrorResponse = {
	result: boolean; // `false` for errors in general
	status: HttpStatusCode;
	errorMessage: string;
};

/**
 * Determine whether `obj` is {@link ErrorResponse} or not.
 * @param obj Object to evaluate.
 * @returns Whether or not.
 */
export function isErrorResponse(obj: unknown): obj is ErrorResponse {
	return (obj as ErrorResponse).result === false;
}
