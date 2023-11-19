import axios, { AxiosError, type AxiosInstance } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { get } from 'svelte/store';
import * as settings from '~/lib/settings';

/**
 * Create new Axios client with all interceptors & caches are set.
 * @returns New Axios instance.
 */
export function getClient(): AxiosInstance {
	const instance = axios.create({
		baseURL: 'https://api.raindrop.io'
	});

	// TODO: Request throttling; https://www.npmjs.com/package/axios-request-throttle
	instance.interceptors.request.use(
		function (config) {
			const accessToken = get(settings.accessToken);
			if (accessToken) {
				config.headers.set('Authorization', `Bearer ${accessToken}`);
			} else {
				switch (config.url) {
					case '/v1/oauth/authorize':
					case '/v1/oauth/access_token':
						// Anonymous requests shouldn't canceled
						// TODO: Is it best? where should I handle this kind of logic?
						console.debug("URL is in whitelist, won't be canceled");
						break;
					default:
						throw new axios.Cancel('Required access token not provided');
				}
			}
			return config;
		},
		function (error: AxiosError) {
			// Handle request errors
			// ...
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		function (response) {
			// Do something with response data
			// ...
			return response;
		},
		function (error: AxiosError) {
			console.error('Response error from server:', error.response?.status);
			if (error.response?.status === 401) {
				// Empty the access token as it is invalidate, preventing further request with expired token
				// NOTE: Use subscriber to refresh token rather than doing so here
				settings.accessToken.set('');
				console.debug('Server replied with status 401, access token may malformed or expired');
			}
			return Promise.reject(error);
		}
	);

	setupCache(instance);

	return instance;
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { it } = import.meta.vitest;

	it.todo('nothing to test yet');
}
/* c8 ignore stop */
