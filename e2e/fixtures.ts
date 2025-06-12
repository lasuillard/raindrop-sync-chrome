import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const test = base.extend<{
	context: BrowserContext;
	extensionId: string;
}>({
	// eslint-disable-next-line no-empty-pattern
	context: async ({}, use) => {
		const pathToExtension = path.join(__dirname, 'my-extension');
		const context = await chromium.launchPersistentContext('', {
			channel: 'chromium',
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`
			]
		});
		await use(context);
		await context.close();
	},
	extensionId: async ({ context }, use) => {
		let [background] = context.serviceWorkers();
		if (!background) background = await context.waitForEvent('serviceworker');

		const extensionId = background.url().split('/')[2];
		await use(extensionId);
	}
});

export const expect = test.expect;
