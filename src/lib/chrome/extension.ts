import { createHash } from 'crypto';
import path from 'path';

/**
 * Get project root directory path.
 * @returns Absolute path to project root directory.
 */
export function getProjectRoot(): string {
	return path.join(__dirname, '../../../');
}

/**
 * Get extension's directory path.
 * @returns Absolute path to extension output directory.
 */
export function getExtensionPath(): string {
	return path.join(getProjectRoot(), 'dist');
}

/**
 * Get extension ID.
 *
 * Ref: https://stackoverflow.com/a/61448618
 * @returns Extension ID, 32-length string of lowercase alphabets only.
 */
export function getExtensionID(): string {
	const base = 'a'.charCodeAt(0);
	const hash = createHash('sha256').update(getExtensionPath()).digest('hex');
	const extensionID = hash
		.split('')
		.map((c) => String.fromCharCode(base + parseInt(c, 16)))
		.join('')
		.slice(0, 32);

	return extensionID;
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { default: path } = await import('path');
	const { describe, expect, it } = import.meta.vitest;

	describe(getProjectRoot, () => {
		it('should be', () => {
			expect(getProjectRoot()).toEqual(path.join(__dirname, '../../../'));
		});
	});

	describe(getExtensionPath, () => {
		it('should be `dist` directory in project root', async () => {
			expect(getExtensionPath()).toEqual(path.join(getProjectRoot(), 'dist'));
		});
	});

	describe(getExtensionID, () => {
		// NOTE: Validity should be checked at e2e tests as it requires Chrome browser behavior, the actual extension ID
		it('should be 32 length string of lowercase alphabets', () => {
			expect(getExtensionID()).toMatch(/[a-z]{32}/);
		});
	});
}
/* c8 ignore stop */
