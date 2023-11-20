import type { Integer, NonNegativeInteger } from '~/lib/types';

export type ID = Integer;
export type UserID = Integer;

export enum SystemCollection {
	All = 0,
	Unsorted = -1,
	Trash = -99
}

/**
 * ID for collection resources.
 *
 * Reserved IDs are: `-99` for Trash, `-1` for Unsorted, `0` for All.
 */
export type CollectionID = SystemCollection | NonNegativeInteger;

export type BookmarkID = Integer;

export type DateStr = string;
export type EmailStr = string;
export type URLStr = string;
export type RGBStr = string;
export type LangStr = string;

/* c8 ignore start */
if (import.meta.vitest) {
	const { it } = import.meta.vitest;

	it('custom type tests run via TS');
}
/* c8 ignore stop */
