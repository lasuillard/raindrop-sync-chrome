import type { PlaywrightTestConfig } from '@playwright/test';

export default {
	use: {
		screenshot: 'only-on-failure'
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
	expect: {
		timeout: 5000,
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.025 // 2.5%
			// ? Perhaps `fullPage` option is not supported here?
		}
	}
} satisfies PlaywrightTestConfig;
