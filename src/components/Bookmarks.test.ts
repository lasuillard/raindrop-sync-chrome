// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import Bookmarks from '~/components/Bookmarks.svelte';

it('has some descriptive heading', () => {
	const { queryByTestId } = render(Bookmarks);
	expect(queryByTestId('heading')).not.toBeNull();
	expect(queryByTestId('description')).not.toBeNull();
});

it.todo('do some tests');
