/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://betterprogramming.pub/getting-started-testing-types-in-typescript-f64306ec16b
import { it } from 'vitest';
import * as types from '~/lib/types';

it('custom type tests run via TS');

{
	let value: types.Integer = 0;
	value = -1;
	value - 12416427893;
	value = 1;
	value = 417489121616378;

	// @ts-expect-error
	value = '1';

	// @ts-expect-error
	value = '1.317819';
}
