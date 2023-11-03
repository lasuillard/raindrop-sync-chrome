import collections from '^/tests/fixtures/collections-childrens.json';
import groups from '^/tests/fixtures/collections.json';
import axios, { HttpStatusCode } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import raindrop from '~/lib/raindrop';

describe(raindrop.collections.getCollectionTree, () => {
	it('build tree from groups and collections', async () => {
		vi.mocked(axios.get).mockImplementation(async (path: string) => {
			switch (path) {
				case '/rest/v1/collections':
					return Promise.resolve({ data: groups });
				case '/rest/v1/collections/childrens':
					return Promise.resolve({ data: collections });
			}
		});

		const tree = await raindrop.collections.getCollectionTree();
		const visits: string[] = [];
		tree.traverse((node) => {
			visits.push(`${node.data?.id || null}: ${node.data?.title || 'root'}`);
		});

		expect(visits).toEqual([
			'-1: Unsorted',
			'35947369: Bookmarks bar',
			'35947370: D1',
			'35947372: D2',
			'35947373: D3',
			'35947374: D2-2',
			'32203872: Default',
			'33302214: Default'
		]);
	});
});

describe(raindrop.collections.fetchGroups, () => {
	it('retrieve data from Raindrop API', async () => {
		vi.mocked(axios.get).mockResolvedValue({
			status: HttpStatusCode.Ok,
			data: groups
		});

		const result = await raindrop.collections.fetchGroups();

		expect(axios.get).toHaveBeenCalledWith('/rest/v1/collections');
		expect(result).toEqual(groups);
	});
});

describe(raindrop.collections.fetchCollections, () => {
	it('retrieve data from Raindrop API', async () => {
		vi.mocked(axios.get).mockResolvedValue({
			status: HttpStatusCode.Ok,
			data: collections
		});

		const result = await raindrop.collections.fetchCollections();

		expect(axios.get).toHaveBeenCalledWith('/rest/v1/collections/childrens');
		expect(result).toEqual(collections);
	});
});
