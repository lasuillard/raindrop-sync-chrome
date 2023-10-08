chrome.runtime.onInstalled.addListener((details) => {
	switch (details.reason) {
		case 'install':
			console.debug('Extension installed');
			break;
		case 'update':
			console.debug('Extension updated');
			break;
	}
});
