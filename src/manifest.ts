// Chrome Manifest Version 3
// https://developer.chrome.com/docs/extensions/mv3/intro/
export default {
	name: 'Raindrop Sync for Chrome',
	version: '0.1.0',
	manifest_version: 3,
	description: 'Inspect background service worker console for output',
	permissions: ['identity', 'storage', 'bookmarks'],
	action: {
		default_title: 'Test',
		default_popup: 'src/popup.html'
	},
	background: {
		service_worker: 'src/service-worker.ts'
	},
	options_page: 'src/options.html'
};
