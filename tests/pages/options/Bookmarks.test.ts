// @vitest-environment happy-dom
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import Bookmarks from '~/pages/options/Bookmarks.svelte';

it('has some descriptive heading', () => {
	const { queryByTestId } = render(Bookmarks);
	expect(queryByTestId('description')).not.toBeNull();
});

it.todo('do some tests');
