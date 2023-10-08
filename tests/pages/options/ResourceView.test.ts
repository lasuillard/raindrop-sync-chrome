// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ResourceView from '~/pages/options/ResourceView.svelte';

describe('ResourceView', () => {
	it('has some descriptive heading', () => {
		const { queryByTestId } = render(ResourceView);
		expect(queryByTestId('heading')).not.toBeNull();
		expect(queryByTestId('description')).not.toBeNull();
	});

	it.todo('do some tests');
});
