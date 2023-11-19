import { RaindropError, isErrorResponse, type ErrorResponse } from './errors';
import { Manager } from './manager';

export class AuthManager extends Manager {
	public launchWebAuthFlow = launchWebAuthFlow;
	public exchangeToken = exchangeToken;
	public refreshToken = refreshToken;
}

export interface AuthFlowParams {
	clientID: string;
	clientSecret: string;
}

export type AuthFlowResponse = {
	accessToken: string;
	refreshToken: string;
	expiresIn: Date;
	tokenType: 'Bearer';
};

/**
 * Initiate OAuth2 Authorization Code Flow for Raindrop API.
 * @param params Auth flow credentials.
 * @returns Response body.
 */
export async function launchWebAuthFlow(
	this: AuthManager,
	params: AuthFlowParams
): Promise<AuthFlowResponse> {
	// NOTE: `url` includes credentials; DO NOT print
	const redirectURL = chrome.identity.getRedirectURL();

	// Build auth flow URL
	const authURL = new URL('https://api.raindrop.io/v1/oauth/authorize');
	authURL.searchParams.set('client_id', params.clientID);
	authURL.searchParams.set('redirect_uri', redirectURL);

	// Initiate auth flow
	console.debug(`Launching web auth flow with with redirectURL "${redirectURL}"`);
	const responseURL = await chrome.identity.launchWebAuthFlow({
		url: authURL.toString(),
		interactive: true
	});
	if (!responseURL) {
		throw new Error('web auth flow error: `responseURL` is empty');
	}
	console.debug(`Got redirection to ${responseURL}`);
	const url = new URL(responseURL);

	// Take out `code` from response URL
	const code = url.searchParams.get('code');
	if (!code) {
		throw new Error('Authorization code not found in URL params');
	}

	// Request access token
	const response = await this.exchangeToken({
		client_id: params.clientID,
		client_secret: params.clientSecret,
		redirect_uri: redirectURL,
		code
	});
	const { access_token, refresh_token, expires_in, token_type } = response;

	// Create `Date` object for expiry date
	const expiresIn = new Date();
	expiresIn.setSeconds(expiresIn.getSeconds() + expires_in);

	console.debug(
		`Exchanged code for auth tokens, token type is "${token_type}" and will expire in ${expiresIn}`
	);

	return {
		accessToken: access_token,
		refreshToken: refresh_token,
		expiresIn,
		tokenType: token_type
	};
}

export interface ExchangeTokenParams {
	client_id: string;
	client_secret: string;
	redirect_uri: string;
	code: string;
}

export type TokenResponse = {
	access_token: string;
	refresh_token: string;
	expires: number; // DEPRECATED; `expires_in` in milliseconds
	expires_in: number; // 2 weeks
	token_type: 'Bearer';
};

/**
 * Exchange authorization code for access token.
 *
 * API documentation: https://developer.raindrop.io/v1/authentication/token
 * @param params API request params.
 * @returns Response body.
 */
export async function exchangeToken(
	this: AuthManager,
	params: ExchangeTokenParams
): Promise<TokenResponse> {
	const { data }: { data: TokenResponse | ErrorResponse } = await this.raindrop.client.post(
		'/v1/oauth/access_token',
		{
			...params,
			grant_type: 'authorization_code'
		}
	);
	if (isErrorResponse(data)) {
		throw new RaindropError(
			`Failed to exchange code for token: ${data.status} ${data.errorMessage}`
		);
	}
	return data;
}

export interface RefreshTokenParams {
	client_id: string;
	client_secret: string;
	refresh_token: string;
}

/**
 * Refresh access token.
 *
 * NOTE: This API uses same endpoint as {@link exchangeToken} but with different params.
 *
 * API documentation: https://developer.raindrop.io/v1/authentication/token
 * @param params API request params.
 * @returns Response body.
 */
export async function refreshToken(
	this: AuthManager,
	params: RefreshTokenParams
): Promise<TokenResponse> {
	const { data }: { data: TokenResponse | ErrorResponse } = await this.raindrop.client.post(
		'/v1/oauth/access_token',
		{
			...params,
			grant_type: 'refresh_token'
		}
	);
	if (isErrorResponse(data)) {
		throw new RaindropError(`Failed to refresh token: ${data.status} ${data.errorMessage}`);
	}
	return data;
}

/* c8 ignore start */
if (import.meta.vitest) {
	const token = await import('^/tests/fixtures/token.json');
	const { default: axios, HttpStatusCode } = await import('axios');
	const chrome = await import('sinon-chrome');
	const { default: raindrop } = await import('~/lib/raindrop');
	const { beforeEach, describe, expect, it, vi } = import.meta.vitest;

	describe(raindrop.auth.launchWebAuthFlow, () => {
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

	describe(raindrop.auth.exchangeToken, () => {
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

	describe(raindrop.auth.refreshToken, () => {
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
}
/* c8 ignore stop */
