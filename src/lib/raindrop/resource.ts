import type { Raindrop } from '.';

export class Resource<R> {
	protected readonly raindrop: Raindrop;
	public readonly rawData: R;

	constructor(raindrop: Raindrop, rawData: R) {
		this.raindrop = raindrop;
		this.rawData = rawData;
	}
}
