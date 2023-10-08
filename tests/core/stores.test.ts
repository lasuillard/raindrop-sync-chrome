import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import * as stores from '~/core/stores';

describe('clientID', () => {
	it('should have an empty string as initial value', () => {
		const ival = get(stores.clientID);
		expect(ival).toEqual('');
	});
});

describe('clientSecret', () => {
	it('should have an empty string as initial value', () => {
		const ival = get(stores.clientSecret);
		expect(ival).toEqual('');
	});
});

describe('accessToken', () => {
	it('should have an empty string as initial value', () => {
		const ival = get(stores.accessToken);
		expect(ival).toEqual('');
	});
});

describe('refreshToken', () => {
	it('should have an empty string as initial value', () => {
		const ival = get(stores.refreshToken);
		expect(ival).toEqual('');
	});
});
