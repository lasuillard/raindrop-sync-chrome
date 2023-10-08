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
		},
		outDir: process.env.VITE_BUILD_OUTDIR ?? 'dist'
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
		include: ['{e2e,tests}/**/*.{test,spec}.{js,ts}'],
		coverage: {
			all: true,
			include: ['src/**'],
			exclude: ['src/**/__mocks__/*'],
			reporter: ['cobertura', 'html'],
			reportsDirectory: `./coverage/${process.env.VITEST_ENV || 'unknown'}`
		},
		setupFiles: ['tests/setup.ts'],
		// NOTE: Existence of field "api" enables API
		// BUG: e2e testing with UI fails due to test rebuilds the output
		...(process.argv.includes('--ui')
			? {
					api: {
						// Publish for * if inside container for forwarding
						host: process.env.CONTAINER !== undefined ? '0.0.0.0' : '127.0.0.1',
						port: 51204,
						strictPort: true
					}
			  }
			: {})
	}
});
