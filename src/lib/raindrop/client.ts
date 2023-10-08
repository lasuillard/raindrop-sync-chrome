import axios, { AxiosError } from 'axios';
import { get } from 'svelte/store';
import * as stores from '~/core/stores';

export const defaultClient = axios.create({
	baseURL: 'https://api.raindrop.io'
});

// TODO: Request throttling; https://www.npmjs.com/package/axios-request-throttle
defaultClient.interceptors.request.use(
	function (config) {
		const accessToken = get(stores.accessToken);
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

defaultClient.interceptors.response.use(
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
			stores.accessToken.set('');
			console.debug('Server replied with status 401, access token may malformed or expired');
		}
		return Promise.reject(error);
	}
);
