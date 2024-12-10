import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
import { viteConfig } from './vite.config';

const { resolve } = viteConfig;

// NOTE: Separate unit test config because coverage report prints out multiple times
//       It's likely problem of CRXJS plugin
//
//       Similar issue: https://github.com/vitest-dev/vitest/issues/3439
console.log(process.env);

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: process.env.VITEST && !process.env.E2E ? ['browser'] : [],
		...resolve
	},
	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		exclude: ['**/__mocks__/*'],
		reporters: ['junit', 'default'],
		outputFile: {
			junit: './junit.xml'
		},
		coverage: {
			all: true,
			include: ['src/**'],
			exclude: ['src/**/__mocks__/*', 'src/**/*.d.ts', 'src/**/*.{test,spec}.ts'],
			reporter: ['text', 'clover', 'html']
		},
		setupFiles: ['dotenv/config', 'tests/setup.ts'],
		api: {
			// Publish for * if inside container for forwarding
			host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1',
			port: 51204
		}
	}
});
