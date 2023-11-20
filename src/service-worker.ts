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

/* c8 ignore start */
if (import.meta.vitest) {
	const { it } = import.meta.vitest;

	it.todo('nothing to test yet');
}
/* c8 ignore stop */
