// @vitest-environment happy-dom
import { render } from '@testing-library/svelte';
import { it } from 'vitest';
import Config from '~/pages/options/Config.svelte';

it('renders OK', () => {
	render(Config);
});
