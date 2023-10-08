/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://betterprogramming.pub/getting-started-testing-types-in-typescript-f64306ec16b
import { describe, it } from 'vitest';
import * as types from '~/lib/types';

describe('custom type tests run via TS', () => {
	it('ok');
});

// @ts-expect-error
const _: types.Integer = '1';
