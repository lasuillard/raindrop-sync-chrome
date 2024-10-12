// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { it } from 'vitest';
import Config from '~/components/Config.svelte';

it('renders OK', () => {
	render(Config);
});
