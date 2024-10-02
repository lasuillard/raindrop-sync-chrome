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
	await chrome.alarms.create('sync-bookmarks', {
		delayInMinutes: 0,
		periodInMinutes: 5
	});
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
