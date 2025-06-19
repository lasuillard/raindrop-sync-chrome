import type { PlaywrightTestConfig } from '@playwright/test';

export default {
	use: {
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		trace: 'on-first-retry'
	},
	testDir: 'e2e',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	reporter: [
		['list'],
		[
			'html',
			{
				open: process.env.CI ? 'never' : 'on-failure',
				host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1'
			}
		],
		['junit', { outputFile: 'junit.xml' }]
	],
	timeout: 30 * 1000,
	retries: process.env.CI ? 2 : 0,
	expect: {
		timeout: 5 * 1000,
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.025 // 2.5%
			// ? Perhaps `fullPage` option is not supported here?
		}
	}
} satisfies PlaywrightTestConfig;
