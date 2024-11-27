// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import Page from '~/pages/popup/Page.svelte';

it('renders OK', () => {
	const { container } = render(Page);
	expect(container).toBeTruthy();
});
