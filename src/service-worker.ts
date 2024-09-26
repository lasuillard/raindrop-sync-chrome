import rd from '~/lib/raindrop';

chrome.runtime.onInstalled.addListener(async (details) => {
	switch (details.reason) {
		case 'install':
			console.debug('Extension installed');
			break;
		case 'update':
			console.debug('Extension updated');
			await chrome.alarms.clearAll();
			break;
	}
	await chrome.alarms.create('demo-default-alarm', {
		delayInMinutes: 0.1,
		periodInMinutes: 1
	});
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
	console.debug('Alarm fired:', alarm);
	const currentUser = await rd.user.getCurrentUser();
	const lastUpdate = currentUser.data.user.lastUpdate;
	if (!lastUpdate) {
		console.warn('No last update found in user data');
		return;
	}
	console.log('lastUpdate', lastUpdate);
});
