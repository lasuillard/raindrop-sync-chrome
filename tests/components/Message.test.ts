// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import Message from '~/components/Message.svelte';

it('renders OK', () => {
	const { container } = render(Message);
	expect(container).toBeTruthy();
});
