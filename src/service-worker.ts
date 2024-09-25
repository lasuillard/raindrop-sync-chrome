chrome.runtime.onInstalled.addListener(async (details) => {
	switch (details.reason) {
		case 'install':
			await chrome.alarms.create('demo-default-alarm', {
				delayInMinutes: 0.1,
				periodInMinutes: 1
			});
			console.debug('Extension installed');
			break;
		case 'update':
			console.debug('Extension updated');
			break;
	}
});

chrome.alarms.onAlarm.addListener((alarm) => {
	console.debug('Alarm fired:', alarm);
});
