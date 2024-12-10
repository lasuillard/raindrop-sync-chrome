// @vitest-environment happy-dom
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';
import About from '~/pages/options/About.svelte';

it('renders OK', () => {
	// @ts-expect-error Mocking conflict
	vi.spyOn(chrome.management, 'getSelf').mockResolvedValueOnce({
		name: '',
		version: '',
		homepageUrl: ''
	});
	const { container } = render(About);
	expect(container).toBeTruthy();
});
