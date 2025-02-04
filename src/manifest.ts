import { defineManifest } from '@crxjs/vite-plugin';
import packageManifest from '../package.json';

// Chrome Manifest Version 3
// https://developer.chrome.com/docs/extensions/mv3/intro/
const manifest = defineManifest(async (env) => {
	return {
		name: 'Raindrop Sync for Chrome',
		version: packageManifest.version,
		manifest_version: 3,
		description: 'Inspect background service worker console for output',
		homepage_url: packageManifest.homepage,
		permissions: ['identity', 'storage', 'bookmarks', 'alarms'],
		host_permissions: [
			'https://api.raindrop.io/*',
			// https://github.com/crxjs/chrome-extension-tools/issues/971
			...(env.mode == 'development' ? ['http://localhost:5173/*'] : [])
		],
		action: {
			default_title: 'Test',
			default_popup: 'src/popup.html'
		},
		background: {
			service_worker: 'src/service-worker.ts',
			type: 'module'
		},
		options_page: 'src/options.html'
	};
});

export default manifest;
