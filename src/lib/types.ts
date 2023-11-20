// Ranged integer:  https://stackoverflow.com/a/70307091/22611794
export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>;

export type Range<L extends number, U extends number> = Exclude<Enumerate<U>, Enumerate<L>>;

export type Integer<N extends number = number> = number extends N
	? N
	: `${N}` extends `${bigint}`
	? N
	: never;

export type PositiveInteger = number;
export type NonNegativeInteger = number;

/* c8 ignore start */
if (import.meta.vitest) {
	const { it } = import.meta.vitest;

	it('custom type tests run via TS');

	{
		let value: Integer = 0;
		value = -1;
		value - 12416427893;
		value = 1;
		value = 417489121616378;

		// @ts-expect-error String value not assignable to integer
		value = '1';

		// @ts-expect-error String value not assignable to integer
		value = '1.317819';
	}
}
/* c8 ignore stop */
