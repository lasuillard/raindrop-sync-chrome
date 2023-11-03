import { describe, expect, it } from 'vitest';
import { isErrorResponse } from '~/lib/raindrop/errors';

describe(isErrorResponse, () => {
	it('type guard for errors should be deterministic', () => {
		expect(isErrorResponse({ result: true })).toBeFalsy();
		expect(isErrorResponse({ result: false })).toBeTruthy();
	});
});
