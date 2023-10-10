import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: [
			{ find: '~', replacement: path.resolve(__dirname, '/src') },
			{ find: '^', replacement: path.resolve(__dirname, '/') }
		]
	},
	test: {
		include: ['e2e/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['e2e/setup.ts']
	}
});
