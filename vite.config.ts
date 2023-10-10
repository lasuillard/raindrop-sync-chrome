import { crx } from '@crxjs/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vitest/config';
import manifest from './src/manifest';

export default defineConfig({
	plugins: [svelte(), crx({ manifest })],
	resolve: {
		alias: [
			{ find: '~', replacement: path.resolve(__dirname, '/src') },
			{ find: '^', replacement: path.resolve(__dirname, '/') }
		]
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			}
		}
	},
	build: {
		target: 'esnext',
		rollupOptions: {
			plugins: [nodePolyfills()]
		}
	},
	server: {
		port: 5173,
		strictPort: true,
		hmr: { port: 5173 }
	},
	test: {
		alias: [
			{ find: /^svelte$/, replacement: 'svelte/internal' } // BUG: https://github.com/vitest-dev/vitest/issues/2834
		],
		include: ['{src,tests}/**/*.{test,spec}.{js,ts}'],
		coverage: {
			all: true,
			include: ['src/**'],
			exclude: ['src/**/__mocks__/*'],
			reporter: ['clover', 'html']
		},
		setupFiles: ['tests/setup.ts'],
		api: {
			// Publish for * if inside container for forwarding
			host: process.env.CONTAINER ? '0.0.0.0' : '127.0.0.1',
			port: 51204,
			strictPort: true
		}
	}
});
