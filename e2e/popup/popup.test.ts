import { expect, test } from '^/e2e/fixtures';

test('page title should be extension name', async ({ page, extensionId }) => {
	await page.goto(`chrome-extension://${extensionId}/src/popup.html`);
	expect(await page.title()).toEqual('Raindrop Sync for Chrome');
});

test('visit page', async ({ page, extensionId }) => {
	await page.goto(`chrome-extension://${extensionId}/src/popup.html`);
	await expect(page).toHaveScreenshot();
});
