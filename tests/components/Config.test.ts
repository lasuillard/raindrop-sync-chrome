// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import Config from '~/components/Config.svelte';

it('has some descriptive heading', () => {
	const { queryByTestId } = render(Config);
	expect(queryByTestId('description')).not.toBeNull();
});
