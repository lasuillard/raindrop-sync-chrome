import { client, generated } from '@lasuillard/raindrop-client';
import axios, { AxiosError, type AxiosInstance } from 'axios';
// import { setupCache } from 'axios-cache-interceptor';
import { get } from 'svelte/store';
import * as settings from '~/lib/settings';

/**
 * Get Raindrop client.
 * @param configuration Raindrop API configuration.
 * @param axiosClient Axios client used for Raindrop API client to make requests.
 * @returns New Raindrop client.
 */
export function getClient(
	configuration?: generated.Configuration,
	axiosClient?: AxiosInstance
): client.Raindrop {
	configuration ??= new generated.Configuration();
	axiosClient ??= getAxiosClient();

	return new client.Raindrop(configuration, axiosClient);
}

/**
 * Create new Axios client with all interceptors & caches are set.
 * @returns New Axios instance.
 */
export function getAxiosClient(): AxiosInstance {
	const instance = axios.create({
		// baseURL: 'https://api.raindrop.io'
	});

	// TODO: Request throttling; https://www.npmjs.com/package/axios-request-throttle
	instance.interceptors.request.use(
		function (config) {
			const accessToken = get(settings.accessToken);
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
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
				// TODO: Refresh token
				// https://www.npmjs.com/package/axios-retry
				settings.accessToken.set('');
				console.debug('Server replied with status 401, access token may malformed or expired');
			}
			return Promise.reject(error);
		}
	);

	// TODO: Disabled premature cache setup for now for debugging purpose
	// setupCache(instance);

	return instance;
}
