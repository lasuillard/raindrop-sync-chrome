import api, { Raindrop } from '@lasuillard/raindrop-client';

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
 * @param raindrop Raindrop API client.
 * @returns Response body.
 */
export async function launchWebAuthFlow(
	params: AuthFlowParams,
	raindrop?: Raindrop
): Promise<AuthFlowResponse> {
	const rd = raindrop ?? new Raindrop();

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
	const { data } = await rd.auth.exchangeToken({
		client_id: params.clientID,
		client_secret: params.clientSecret,
		redirect_uri: redirectURL,
		code
	});
	const {
		access_token: accessToken,
		refresh_token: refreshToken,
		expires_in,
		token_type: tokenType
	} = data as api.TokenResponse;

	const expiresIn = new Date();
	expiresIn.setSeconds(expiresIn.getSeconds() + expires_in);

	console.debug(
		`Exchanged code for auth tokens, token type is "${tokenType}" and will expire in ${expiresIn}`
	);

	return { accessToken, refreshToken, expiresIn, tokenType };
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { default: tokenResponse } = await import('^/tests/fixtures/token.json');
	const chrome = await import('sinon-chrome');
	const { beforeEach, describe, expect, it, vi } = import.meta.vitest;

	const rd = new Raindrop();

	describe(launchWebAuthFlow, () => {
		beforeEach(() => {
			chrome.identity.getRedirectURL.returns('https://extension-id.chromiumapp.org/');
			chrome.identity.launchWebAuthFlow
				.withArgs({
					url: 'https://api.raindrop.io/v1/oauth/authorize?client_id=client-id&redirect_uri=https%3A%2F%2Fextension-id.chromiumapp.org%2F',
					interactive: true
				})
				.returns('https://extension-id.chromiumapp.org/?code=authorization-code');
		});

		it('conforms to OAuth 2.0 Authorization Code Flow', async () => {
			vi.spyOn(rd.auth, 'exchangeToken').mockReturnValueOnce({
				// @ts-expect-error Enough for mocking
				data: tokenResponse
			});

			const result = await launchWebAuthFlow(
				{
					clientID: 'client-id',
					clientSecret: 'client-secret'
				},
				rd
			);
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
				launchWebAuthFlow({
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
				launchWebAuthFlow({
					clientID: 'client-id',
					clientSecret: 'client-secret'
				})
			).rejects.toThrowError('Authorization code not found in URL params');
		});
	});
}
/* c8 ignore stop */
