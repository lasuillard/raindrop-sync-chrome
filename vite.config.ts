import { crx } from '@crxjs/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vitest/config';
import manifest from './src/manifest';

export const viteConfig = {
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
		sourcemap: true
	},
	server: {
		port: 5173,
		strictPort: true,
		hmr: { port: 5173 }
	}
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default defineConfig(viteConfig);
