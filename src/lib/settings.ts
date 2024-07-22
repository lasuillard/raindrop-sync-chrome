import { persisted } from './stores';

const options = {
	storage: chrome.storage.sync
};

export const clientID = await persisted('clientID', '', options);
export const clientSecret = await persisted('clientSecret', '', options);
export const accessToken = await persisted('accessToken', '', options);
export const refreshToken = await persisted('refreshToken', '', options);

/**
 * Store tracking when last action made in remote resources (raindrop.io) to manage caches
 *
 * It should be determined based on:
 * - When last fetch made by extension
 * - Hints from resource servers, such as `$.user.lastAction`, `$.user.lastVisit` from user info data
 */
export const lastTouch = await persisted('lastTouch', null, options);
