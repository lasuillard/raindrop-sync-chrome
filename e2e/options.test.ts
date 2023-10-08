import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getExtensionID, getExtensionPath } from '~/utils/chrome-extension';

const extensionPath = getExtensionPath();
const extensionID = getExtensionID();

// Extension base URL
const baseURL = `chrome-extension://${extensionID}`;

describe('basic', async () => {
	let browser: Browser;
	let page: Page;

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: 'new',
			args: [
				'--disable-gpu',
				'--no-sandbox',
				`--disable-extensions-except=${extensionPath}`,
				`--load-extension=${extensionPath}`
			]
		});
		page = await browser.newPage();
		await page.goto(`${baseURL}/src/options.html`);
	});

	afterAll(async () => {
		await browser.close();
	});

	it('page title should be extension name', async () => {
		expect(await page.title()).toEqual('Raindrop Sync for Chrome');
	});

	it('options should have some some content', async () => {
		await page.waitForSelector('body');
		expect(await page.content()).toContain('Raindrop Sync for Chrome');
	}, 60_000);
});
