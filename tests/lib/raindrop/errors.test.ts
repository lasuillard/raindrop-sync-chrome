import { describe, expect, it } from 'vitest';
import { isErrorResponse } from '~/lib/raindrop/errors';

describe('errors', () => {
	it('should be determined', () => {
		expect(isErrorResponse({ result: true })).toBeFalsy();
		expect(isErrorResponse({ result: false })).toBeTruthy();
	});
});
