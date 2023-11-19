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

/* c8 ignore start */
if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe(isErrorResponse, () => {
		it('type guard for errors should be deterministic', () => {
			expect(isErrorResponse({ result: true })).toBeFalsy();
			expect(isErrorResponse({ result: false })).toBeTruthy();
		});
	});
}
/* c8 ignore stop */
