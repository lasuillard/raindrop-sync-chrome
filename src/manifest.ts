import packageManifest from '../package.json';

// Chrome Manifest Version 3
// https://developer.chrome.com/docs/extensions/mv3/intro/
const manifest = {
	name: 'Raindrop Sync for Chrome',
	version: packageManifest.version,
	manifest_version: 3,
	description: 'Inspect background service worker console for output',
	homepage_url: packageManifest.homepage,
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

export default manifest;

/* c8 ignore start */
if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('metadata should match project info', () => {
		expect(manifest.name).toEqual('Raindrop Sync for Chrome');
		expect(manifest.version).toEqual(packageManifest.version);
		expect(manifest.description).not.toEqual('');
	});
}
/* c8 ignore stop */
