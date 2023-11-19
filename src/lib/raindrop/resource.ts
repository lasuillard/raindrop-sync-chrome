import type { Raindrop } from '.';

export class Resource<R> {
	protected readonly raindrop: Raindrop;
	public readonly rawData: R;

	constructor(raindrop: Raindrop, rawData: R) {
		this.raindrop = raindrop;
		this.rawData = rawData;
	}
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { it } = import.meta.vitest;

	it.todo('nothing to test yet');
}
/* c8 ignore stop */
