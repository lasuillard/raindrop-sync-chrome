import { describe, expect, it } from 'vitest';
import { persisted } from '~/lib/stores';

describe('persisted', () => {
	it('should implement original store interface', async () => {
		const store = await persisted('test', '');

		// Subscription test
		let changed = '';
		store.subscribe((value) => {
			changed = value;
		});

		await store.set('hello world');
		expect(changed).toEqual('hello world');

		// `.update()`
		await store.update((value) => value + ', done');
		expect(changed).toEqual('hello world, done');
	});
});
