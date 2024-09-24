import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
import { viteConfig } from './vite.config';

const { resolve } = viteConfig;

// NOTE: Separate unit test config because coverage report prints out multiple times
//       It's likely problem of CRXJS plugin
//
//       Similar issue: https://github.com/vitest-dev/vitest/issues/3439
export default defineConfig({
	plugins: [svelte()],
	resolve,
	test: {
		alias: [
			{ find: /^svelte$/, replacement: 'svelte/internal' } // BUG: https://github.com/vitest-dev/vitest/issues/2834
		],
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		exclude: ['**/__mocks__/*'],
		reporters: ['junit'],
		outputFile: {
			junit: './junit.xml'
		},
		coverage: {
			all: true,
			include: ['src/**'],
			exclude: ['src/**/__mocks__/*', 'src/**/*.d.ts', 'src/**/*.{test,spec}.ts'],
			reporter: ['text', 'clover', 'html']
		},
		setupFiles: ['tests/setup.ts'],
		api: {
			// Publish for * if inside container for forwarding
			host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1',
			port: 51204
		}
	}
});
