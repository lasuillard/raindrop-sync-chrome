// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import Config from '~/components/Config.svelte';
import * as stores from '~/core/stores';

it('has some descriptive heading', () => {
	const { queryByTestId } = render(Config);
	expect(queryByTestId('description')).not.toBeNull();
});

describe('client ID', () => {
	it('is editable', () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('client-id/input') as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.getAttributeNames()).not.toContain('disabled');
	});

	it('is masked by default and able to toggle it', async () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('client-id/input') as HTMLInputElement;
		expect(input.getAttribute('type')).toEqual('password');
		const eye = getByTestId('client-id/show-button');
		eye.click();
		await tick();
		expect(input.getAttribute('type')).toEqual('text');
	});

	it('is bound to store', async () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('client-id/input') as HTMLInputElement;
		expect(input.value).toEqual('');
		stores.clientID.set('new-client-id');
		await tick();
		expect(input.value).toEqual('new-client-id');
	});
});

describe('client secret', () => {
	it('is editable', () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('client-secret/input') as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.getAttributeNames()).not.toContain('disabled');
	});

	it('is masked by default and able to toggle it', async () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('client-secret/input') as HTMLInputElement;
		expect(input.getAttribute('type')).toEqual('password');
		const eye = getByTestId('client-secret/show-button');
		eye.click();
		await tick();
		expect(input.getAttribute('type')).toEqual('text');
	});

	it('is bound to store', async () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('client-secret/input') as HTMLInputElement;
		expect(input.value).toEqual('');
		stores.clientSecret.set('new-client-secret');
		await tick();
		expect(input.value).toEqual('new-client-secret');
	});
});

describe('access token', () => {
	it('is read-only', () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('access-token/input') as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.getAttributeNames()).toContain('disabled');
	});

	it('is masked by default and able to toggle it', async () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('access-token/input') as HTMLInputElement;
		expect(input.getAttribute('type')).toEqual('password');
		const eye = getByTestId('access-token/show-button');
		eye.click();
		await tick();
		expect(input.getAttribute('type')).toEqual('text');
	});

	it('is bound to store', async () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('access-token/input') as HTMLInputElement;
		expect(input.value).toEqual('');
		stores.accessToken.set('new-access-token');
		await tick();
		expect(input.value).toEqual('new-access-token');
	});
});

describe('refresh token', () => {
	it('is read-only', () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('refresh-token/input') as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.getAttributeNames()).toContain('disabled');
	});

	it('is masked by default and able to toggle it', async () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('refresh-token/input') as HTMLInputElement;
		expect(input.getAttribute('type')).toEqual('password');
		const eye = getByTestId('refresh-token/show-button');
		eye.click();
		await tick();
		expect(input.getAttribute('type')).toEqual('text');
	});

	it('is bound to store', async () => {
		const { getByTestId } = render(Config);
		const input = getByTestId('refresh-token/input') as HTMLInputElement;
		expect(input.value).toEqual('');
		stores.refreshToken.set('new-refresh-token');
		await tick();
		expect(input.value).toEqual('new-refresh-token');
	});
});
