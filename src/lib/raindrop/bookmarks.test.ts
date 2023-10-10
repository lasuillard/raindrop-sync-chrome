import raindrops from '^/tests/fixtures/raindrops.json';
import axios, { HttpStatusCode } from 'axios';
import { describe, expect, it, test, vi } from 'vitest';
import raindrop from '~/lib/raindrop';

describe(raindrop.bookmarks.getAllBookmarks.name, () => {
	it('fetch full pagination results', async () => {
		const data = { ...raindrops, count: 20 };
		vi.mocked(axios.get).mockImplementation(async () => ({
			status: HttpStatusCode.Ok,
			data: JSON.parse(JSON.stringify(data)) // Need deep copy due to property changes
		}));

		const result = await raindrop.bookmarks.getAllBookmarks({ pageSize: 5 });

		expect(axios.get).toHaveBeenCalledTimes(4);
		const calledWith = [
			{ params: { search: '', sort: '', page: 0, perpage: 5 } },
			{ params: { search: '', sort: '', page: 1, perpage: 5 } },
			{ params: { search: '', sort: '', page: 2, perpage: 5 } },
			{ params: { search: '', sort: '', page: 3, perpage: 5 } }
		];
		for (const args of calledWith) {
			expect(axios.get).toHaveBeenCalledWith('/rest/v1/raindrops/0', args);
		}
		expect(result).toHaveLength(20);
	});

	test.todo('selectively include `"Unsorted"` system collection');
	test.todo('selectively include `"Trash"` system collection');
});

describe(raindrop.bookmarks.fetchBookmarks.name, () => {
	it('retrieve data from Raindrop API', async () => {
		vi.mocked(axios.get).mockResolvedValue({
			status: HttpStatusCode.Ok,
			data: raindrops
		});

		const result = await raindrop.bookmarks.fetchBookmarks({
			page: 0,
			perpage: 5
		});

		expect(axios.get).toHaveBeenCalledWith('/rest/v1/raindrops/0', {
			params: {
				search: '',
				sort: '',
				page: 0,
				perpage: 5
			}
		});
		expect(result).toEqual(raindrops);
	});

	it('`sort` option `"score"` needs `search` not empty', () => {
		expect(
			raindrop.bookmarks.fetchBookmarks({
				sort: 'score',
				page: 0,
				perpage: 5
			})
		).rejects.toThrow('`sort` option `"score"` can be used only if `search` query is not empty');
	});
});
