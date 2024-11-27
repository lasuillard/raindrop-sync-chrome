// @vitest-environment jsdom
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import SecretInput from '~/components/SecretInput.svelte';

it('renders OK', () => {
	const { container } = render(SecretInput);
	expect(container).toBeTruthy();
});
