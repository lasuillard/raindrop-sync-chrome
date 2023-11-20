import type { Raindrop } from '.';

export class Manager {
	protected raindrop: Raindrop;

	constructor(raindrop: Raindrop) {
		this.raindrop = raindrop;
	}
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { it } = import.meta.vitest;

	it.todo('nothing to test yet');
}
/* c8 ignore stop */
