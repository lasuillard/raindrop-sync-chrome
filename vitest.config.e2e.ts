import { defineConfig } from 'vitest/config';
import { viteConfig } from './vite.config';

const { resolve } = viteConfig;

export default defineConfig({
	resolve,
	test: {
		include: ['e2e/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['e2e/setup.ts']
	}
});
