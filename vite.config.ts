import { codecovVitePlugin } from '@codecov/vite-plugin';
import { crx } from '@crxjs/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vitest/config';
import manifest from './src/manifest';

export const viteConfig = {
	plugins: [
		svelte(),
		crx({ manifest }),
		codecovVitePlugin({
			enableBundleAnalysis: true,
			bundleName: 'raindrop-sync-chrome',
			oidc: {
				useGitHubOIDC: true
			}
		})
	],
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
	},
	// https://github.com/crxjs/chrome-extension-tools/issues/971
	legacy: {
		skipWebSocketTokenCheck: true
	}
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default defineConfig(viteConfig);
