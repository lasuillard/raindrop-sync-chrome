import path from 'path';
import { describe, expect, it } from 'vitest';
import { getExtensionID, getExtensionPath, getProjectRoot } from '~/utils/chrome-extension';

describe(getProjectRoot, () => {
	it('should be', () => {
		expect(getProjectRoot()).toEqual(path.join(__dirname, '../../'));
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
