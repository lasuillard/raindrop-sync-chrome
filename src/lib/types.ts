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
