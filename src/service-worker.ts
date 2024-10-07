import { get } from 'svelte/store';
import * as settings from '~/lib/settings';
import { syncBookmarks } from '~/lib/sync';

chrome.runtime.onInstalled.addListener(async (details) => {
	switch (details.reason) {
		case chrome.runtime.OnInstalledReason.INSTALL:
			console.debug('Extension installed');
			break;
		case chrome.runtime.OnInstalledReason.UPDATE:
			console.debug('Extension updated, re-scheduling alarms');
			await chrome.alarms.clearAll();
			break;
	}

	const autoSyncEnabled = get(settings.autoSyncEnabled);
	if (autoSyncEnabled) {
		const execOnStartup = get(settings.autoSyncExecOnStartup);
		const delayInMinutes = execOnStartup ? 0 : undefined;
		const periodInMinutes = get(settings.autoSyncIntervalInMinutes);
		if (!execOnStartup) {
			console.info('Sync on startup is disabled');
		}
		console.debug(`Scheduling alarms with delay: ${delayInMinutes}, period: ${periodInMinutes}`);
		await chrome.alarms.create('sync-bookmarks', { delayInMinutes, periodInMinutes });
	}
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
	console.debug('Alarm fired:', alarm.name);
	switch (alarm.name) {
		case 'sync-bookmarks':
			console.debug('Syncing bookmarks');
			await syncBookmarks();
			break;
	}
});
