import { expect, test } from '^/e2e/fixtures';

test('page title should be extension name', async ({ page, extensionId }) => {
	await page.goto(`chrome-extension://${extensionId}/src/popup.html`);
	expect(await page.title()).toEqual('Raindrop Sync for Chrome');
});

test('popup should have some content', async ({ page, extensionId }) => {
	await page.goto(`chrome-extension://${extensionId}/src/popup.html`);
	await page.waitForSelector('body');
	expect(await page.content()).toContain('Raindrop Sync for Chrome');
});
