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
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		function (response) {
			return response;
		},
		async function (error: AxiosError) {
			console.error('Response error from server:', error.response?.status);
			if (error.response?.status === 401) {
				if (!get(settings.refreshToken)) {
					console.error('No refresh token available, cannot refresh access token');
					return Promise.reject(error);
				}

				// TODO(lasuillard): Refresh works OK, but it(refresh)'s being called multiple times
				//                   Consider implementing a lock mechanism to prevent multiple refresh calls
				//                   e.g. https://github.com/kirill-konshin/mutex-promise
				tryRefreshAccessToken(instance);

				console.debug('Retrying request with new access token');
				// @ts-expect-error Ignore TS error for now
				return instance(error.config);
			}
			return Promise.reject(error);
		}
	);

	// TODO: Disabled premature cache setup for now for debugging purpose
	// setupCache(instance);

	return instance;
}

/**
 * Try to get new access token using refresh token.
 * If successful, updates access token in settings. Otherwise, clears tokens.
 * @param instance Axios instance to use for the request.
 */
async function tryRefreshAccessToken(instance: AxiosInstance): Promise<void> {
	const client = getClient(undefined, instance);
	try {
		const response = await client.auth.refreshToken({
			client_id: get(settings.clientID),
			client_secret: get(settings.clientSecret),
			refresh_token: get(settings.refreshToken)
		});
		const newAccessToken = response.data.access_token;
		console.log('Retrieved new access token using refresh token');
		settings.accessToken.set(newAccessToken);
	} catch (err) {
		// If refresh fails, clear tokens
		settings.accessToken.set('');
		settings.refreshToken.set('');
		throw new Error(`Failed to refresh access token: ${err}`);
	}
}
