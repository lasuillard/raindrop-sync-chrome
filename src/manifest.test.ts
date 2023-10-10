import pkg from 'package.json';
import { describe, expect, it } from 'vitest';
import manifest from '~/manifest';

describe('manifest', () => {
	it('metadata should match project info', () => {
		expect(manifest.name).toEqual('Raindrop Sync for Chrome');
		expect(manifest.version).toEqual(pkg.version);
		expect(manifest.description).not.toEqual('');
	});
});
