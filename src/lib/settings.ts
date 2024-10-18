import { get } from 'svelte/store';
import { DummyStorage, persisted } from './stores';

const options = {
	storage: import.meta.env.MODE === 'test' ? new DummyStorage() : chrome.storage.sync
};

// API credentials
// NOTE: Can use test token for access token instead of OAuth flow
export const clientID = persisted('clientID', '', options);
export const clientSecret = persisted('clientSecret', '', options);
export const accessToken = persisted('accessToken', '', options);
export const refreshToken = persisted('refreshToken', '', options);

// Timestamp of the last time changes made in Raindrop.io
export const lastTouch = persisted('lastTouch', new Date(0), {
	...options,
	serializer: (value: Date) => value.toJSON(),
	deserializer: (value: string) => new Date(value)
});

// Parent bookmark ID to create new bookmarks under
export const syncLocation = persisted<string>('syncLocation', '', options);

// Auto-sync configurations
export const autoSyncEnabled = persisted('autoSyncEnabled', false, options);
export const autoSyncIntervalInMinutes = persisted('autoSyncIntervalInMinutes', 5, options);
export const autoSyncExecOnStartup = persisted('autoSyncExecOnStartup', false, options);

/**
 * Schedule auto-sync alarms based on the current settings.
 */
export async function scheduleAutoSync() {
	console.debug('Scheduling auto-sync alarms');
	await chrome.alarms.clearAll();

	if (get(autoSyncEnabled) !== true) {
		console.info('Auto-sync is disabled');
		return;
	}

	const execOnStartup = get(autoSyncExecOnStartup);
	if (!execOnStartup) {
		console.info('Sync on startup is disabled');
	}

	// If `undefined`, sync on startup is disabled
	const delayInMinutes = execOnStartup ? 0 : undefined;

	const periodInMinutes = get(autoSyncIntervalInMinutes);

	console.debug(`Scheduling alarms with delay: ${delayInMinutes}, period: ${periodInMinutes}`);
	await chrome.alarms.create('sync-bookmarks', { delayInMinutes, periodInMinutes });
}
