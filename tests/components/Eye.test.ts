// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Eye from '~/components/Eye.svelte';

describe('Eye', () => {
	it('open', async () => {
		const { queryByTestId } = render(Eye, { open: true });
		expect(queryByTestId('eye-open')).toBeTruthy();
		expect(queryByTestId('eye-closed')).toBeNull();
	});

	it('close', () => {
		const { queryByTestId } = render(Eye, { open: false });
		expect(queryByTestId('eye-open')).toBeNull();
		expect(queryByTestId('eye-closed')).toBeTruthy();
	});
});
