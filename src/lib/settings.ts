import { persisted } from './stores';

const options = {
	storage: chrome.storage.sync
};

export const clientID = await persisted('clientID', '', options);
export const clientSecret = await persisted('clientSecret', '', options);
export const accessToken = await persisted('accessToken', '', options);
export const refreshToken = await persisted('refreshToken', '', options);

/**
 * Store tracking when last action made in remote resources (raindrop.io) to manage caches
 *
 * It should be determined based on:
 * - When last fetch made by extension
 * - Hints from resource servers, such as `$.user.lastAction`, `$.user.lastVisit` from user info data
 */
export const lastTouch = await persisted('lastTouch', null, options);

/* c8 ignore start */
if (import.meta.vitest) {
	const { get } = await import('svelte/store');
	const { describe, expect, it } = import.meta.vitest;

	describe('clientID', () => {
		it('should have an empty string as initial value', () => {
			const ival = get(clientID);
			expect(ival).toEqual('');
		});
	});

	describe('clientSecret', () => {
		it('should have an empty string as initial value', () => {
			const ival = get(clientSecret);
			expect(ival).toEqual('');
		});
	});

	describe('accessToken', () => {
		it('should have an empty string as initial value', () => {
			const ival = get(accessToken);
			expect(ival).toEqual('');
		});
	});

	describe('refreshToken', () => {
		it('should have an empty string as initial value', () => {
			const ival = get(refreshToken);
			expect(ival).toEqual('');
		});
	});
}
/* c8 ignore stop */
