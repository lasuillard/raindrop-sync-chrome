import { DummyStorage, persisted } from './stores';

const options = {
	storage: import.meta.env.MODE === 'test' ? new DummyStorage() : chrome.storage.sync
};

export const clientID = persisted('clientID', '', options);
export const clientSecret = persisted('clientSecret', '', options);
export const accessToken = persisted('accessToken', '', options);
export const refreshToken = persisted('refreshToken', '', options);

/**
 * Store tracking when last action made in remote resources (raindrop.io) to manage caches
 *
 * It should be determined based on:
 * - When last fetch made by extension
 * - Hints from resource servers, such as `$.user.lastAction`, `$.user.lastVisit` from user info data
 */
export const lastTouch = persisted('lastTouch', new Date(0), {
	...options,
	serializer: (value: Date) => value.toJSON(),
	deserializer: (value: string) => new Date(value)
});
