import token from '^/tests/fixtures/token.json';
import axios, { HttpStatusCode } from 'axios';
import * as chrome from 'sinon-chrome';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import raindrop from '~/lib/raindrop';

describe(raindrop.auth.launchWebAuthFlow.name, () => {
	beforeEach(() => {
		chrome.identity.getRedirectURL.returns('https://extension-id.chromiumapp.org/');
		chrome.identity.launchWebAuthFlow
			.withArgs({
				url: 'https://api.raindrop.io/v1/oauth/authorize?client_id=client-id&redirect_uri=https%3A%2F%2Fextension-id.chromiumapp.org%2F',
				interactive: true
			})
			.returns('https://extension-id.chromiumapp.org/?code=authorization-code');

		vi.mocked(axios.post).mockResolvedValue({
			data: token
		});
	});

	it('conforms to OAuth 2.0 Authorization Code Flow', async () => {
		const result = await raindrop.auth.launchWebAuthFlow({
			clientID: 'client-id',
			clientSecret: 'client-secret'
		});
		expect(result).toEqual({
			accessToken: '<ACCESS_TOKEN>',
			refreshToken: '<REFRESH_TOKEN>',
			expiresIn: expect.any(Date), // It is dynamic; now + `expiresIn` seconds
			tokenType: 'Bearer'
		});
	});

	it('throws an error if `responseURL` not provided', async () => {
		chrome.identity.launchWebAuthFlow
			.withArgs({
				url: 'https://api.raindrop.io/v1/oauth/authorize?client_id=client-id&redirect_uri=https%3A%2F%2Fextension-id.chromiumapp.org%2F',
				interactive: true
			})
			.returns(undefined);

		expect(
			raindrop.auth.launchWebAuthFlow({
				clientID: 'client-id',
				clientSecret: 'client-secret'
			})
		).rejects.toThrowError('web auth flow error: `responseURL` is empty');
	});

	it('throws an error if `code` not provided', async () => {
		chrome.identity.launchWebAuthFlow
			.withArgs({
				url: 'https://api.raindrop.io/v1/oauth/authorize?client_id=client-id&redirect_uri=https%3A%2F%2Fextension-id.chromiumapp.org%2F',
				interactive: true
			})
			.returns('https://extension-id.chromiumapp.org/?_code=authorization-code');

		expect(
			raindrop.auth.launchWebAuthFlow({
				clientID: 'client-id',
				clientSecret: 'client-secret'
			})
		).rejects.toThrowError('Authorization code not found in URL params');
	});
});

describe(raindrop.auth.exchangeToken.name, () => {
	it('retrieve data from Raindrop API', async () => {
		vi.mocked(axios.post).mockResolvedValue({
			status: HttpStatusCode.Ok,
			data: {
				access_token: '<ACCESS_TOKEN>',
				refresh_token: '<REFRESH_TOKEN>',
				expires: 1209599970,
				expires_in: 1209599,
				token_type: 'Bearer'
			}
		});

		const result = await raindrop.auth.exchangeToken({
			client_id: '<CLIENT_ID>',
			client_secret: '<CLIENT_SECRET>',
			redirect_uri: '<REDIRECT_URI>',
			code: '<AUTHORIZATION_CODE>'
		});

		expect(axios.post).toHaveBeenCalledWith('/v1/oauth/access_token', {
			client_id: '<CLIENT_ID>',
			client_secret: '<CLIENT_SECRET>',
			redirect_uri: '<REDIRECT_URI>',
			code: '<AUTHORIZATION_CODE>',
			grant_type: 'authorization_code'
		});
		expect(result).toEqual({
			access_token: '<ACCESS_TOKEN>',
			refresh_token: '<REFRESH_TOKEN>',
			expires: 1209599970,
			expires_in: 1209599,
			token_type: 'Bearer'
		});
	});

	it('throws error if exchange failed', () => {
		vi.mocked(axios.post).mockResolvedValue({
			status: HttpStatusCode.Ok,
			data: {
				result: false,
				status: HttpStatusCode.BadRequest,
				errorMessage: 'Incorrect code'
			}
		});

		expect(
			raindrop.auth.exchangeToken({
				client_id: '<CLIENT_ID>',
				client_secret: '<CLIENT_SECRET>',
				redirect_uri: '<REDIRECT_URI>',
				code: '<AUTHORIZATION_CODE>'
			})
		).rejects.toThrowError('Failed to exchange code for token: 400 Incorrect code');
		expect(axios.post).toHaveBeenCalledWith('/v1/oauth/access_token', {
			client_id: '<CLIENT_ID>',
			client_secret: '<CLIENT_SECRET>',
			redirect_uri: '<REDIRECT_URI>',
			code: '<AUTHORIZATION_CODE>',
			grant_type: 'authorization_code'
		});
	});
});

describe(raindrop.auth.refreshToken.name, () => {
	it('retrieve data from Raindrop API', async () => {
		vi.mocked(axios.post).mockResolvedValue({
			status: HttpStatusCode.Ok,
			data: {
				access_token: '<ACCESS_TOKEN>',
				refresh_token: '<REFRESH_TOKEN>',
				expires: 1209599970,
				expires_in: 1209599,
				token_type: 'Bearer'
			}
		});

		const result = await raindrop.auth.refreshToken({
			client_id: '<CLIENT_ID>',
			client_secret: '<CLIENT_SECRET>',
			refresh_token: '<REFRESH_TOKEN>'
		});

		expect(axios.post).toHaveBeenCalledWith('/v1/oauth/access_token', {
			client_id: '<CLIENT_ID>',
			client_secret: '<CLIENT_SECRET>',
			refresh_token: '<REFRESH_TOKEN>',
			grant_type: 'refresh_token'
		});
		expect(result).toEqual({
			access_token: '<ACCESS_TOKEN>',
			refresh_token: '<REFRESH_TOKEN>',
			expires: 1209599970,
			expires_in: 1209599,
			token_type: 'Bearer'
		});
	});

	it('throws error if refresh failed', () => {
		vi.mocked(axios.post).mockResolvedValue({
			status: HttpStatusCode.Ok,
			data: {
				result: false,
				status: HttpStatusCode.BadRequest,
				errorMessage: 'Incorrect refresh_token'
			}
		});

		expect(
			raindrop.auth.refreshToken({
				client_id: '<CLIENT_ID>',
				client_secret: '<CLIENT_SECRET>',
				refresh_token: '<REFRESH_TOKEN>'
			})
		).rejects.toThrowError('Failed to refresh token: 400 Incorrect refresh_token');
		expect(axios.post).toHaveBeenCalledWith('/v1/oauth/access_token', {
			client_id: '<CLIENT_ID>',
			client_secret: '<CLIENT_SECRET>',
			refresh_token: '<REFRESH_TOKEN>',
			grant_type: 'refresh_token'
		});
	});
});
