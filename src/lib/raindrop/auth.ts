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
