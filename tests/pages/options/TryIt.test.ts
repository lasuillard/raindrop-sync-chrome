// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TryIt from '~/pages/options/TryIt.svelte';

it('has some descriptive heading', () => {
	const { queryByTestId } = render(TryIt);
	expect(queryByTestId('description')).not.toBeNull();
});

describe('query', () => {
	it('is editable with some placeholder', () => {
		const { getByTestId } = render(TryIt);
		const input = getByTestId('query/input') as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.getAttributeNames()).not.toContain('disabled');
		expect(input.placeholder.length).toBeGreaterThan(0);
	});
});

describe('query result', () => {
	it('is read-only and has default "null"', () => {
		const { getByTestId } = render(TryIt);
		const result = getByTestId('query/result') as HTMLInputElement;
		expect(result).toBeTruthy();
		expect(result.getAttributeNames()).toContain('disabled');
		expect(result.value).toEqual('null');
	});
});
