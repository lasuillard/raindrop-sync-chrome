import type { Raindrop } from '.';

export class Manager {
	protected raindrop: Raindrop;

	constructor(raindrop: Raindrop) {
		this.raindrop = raindrop;
	}
}
