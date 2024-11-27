/* eslint-disable jsdoc/require-jsdoc */
import type { Use } from '@vitest/runner';
import axios, { type AxiosInstance } from 'axios';

// eslint-disable-next-line no-empty-pattern
export async function axiosInstance({}, use: Use<AxiosInstance>) {
	const instance = axios.create({
		validateStatus: () => true
	});
	await use(instance);
}
