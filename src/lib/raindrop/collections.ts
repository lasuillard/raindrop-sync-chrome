import { TreeNode, makeTree, type TreeSource } from '~/lib/tree';
import type { Integer, NonNegativeInteger } from '~/lib/types';
import type { Bookmark } from './bookmarks';
import { Manager } from './manager';
import { Resource } from './resource';
import {
	SystemCollection,
	type CollectionID,
	type DateStr,
	type EmailStr,
	type ID,
	type RGBStr,
	type URLStr,
	type UserID
} from './types';

export class CollectionManager extends Manager {
	/**
	 * All bookmarks.
	 * @returns System collection for all.
	 */
	get All(): Collection {
		const raindrop = this.raindrop;
		return {
			id: SystemCollection.All,
			title: 'All',
			slug: 'all',

			async getBookmarks(): Promise<Bookmark[]> {
				return await raindrop.bookmarks.getAllBookmarks({
					collection: this.id
				});
			}
		};
	}

	/**
	 * Bookmarks that isn't included in any collection appear here
	 * @returns System collection for unsorted.
	 */
	get Unsorted(): Collection {
		return {
			...this.All,
			id: SystemCollection.Unsorted,
			title: 'Unsorted',
			slug: 'unsorted'
		};
	}

	/**
	 * Deleted bookmark goes here.
	 * @returns System collection for trashed bookmarks
	 */
	get Trash(): Collection {
		return {
			...this.All,
			id: SystemCollection.Trash,
			title: 'Trash',
			slug: 'trash'
		};
	}

	public getCollectionTree = getCollectionTree;
	public fetchGroups = fetchGroups;
	public fetchCollections = fetchCollections;
}

type RawGroupData = FetchGroupsResponse['items'][0];
type RawCollectionData = FetchCollectionsResponse['items'][0];
type RawData = RawGroupData | RawCollectionData;

/** Collection interface to support system collections. */
export interface Collection {
	get id(): CollectionID;
	get title(): string;
	get slug(): string;

	/**
	 * Helper method loading raindrops of this collection.
	 * @returns Array of raindrops in this collection.
	 */
	getBookmarks(): Promise<Bookmark[]>;
}

export class UserCollection extends Resource<RawData> implements Collection {
	get id(): CollectionID {
		return this.rawData._id;
	}

	get title(): string {
		return this.rawData.title;
	}

	get slug(): string {
		return this.rawData.slug;
	}

	async getBookmarks(): Promise<Bookmark[]> {
		return await this.raindrop.bookmarks.getAllBookmarks({
			collection: this.id
		});
	}
}

/**
 * Create full collection tree.
 * @returns Root node of created tree.
 */
export async function getCollectionTree(this: CollectionManager): Promise<TreeNode<Collection>> {
	const [groups, collections] = await Promise.all([this.fetchGroups(), this.fetchCollections()]);

	const raindrop = this.raindrop;
	const groupNodes: TreeSource<RawData, UserCollection>[] = groups.items.map((item) => ({
		data: item,
		id: item._id.toString(),
		parent: null,

		toNode(): TreeNode<UserCollection> {
			return new TreeNode(new UserCollection(raindrop, this.data));
		}
	}));
	const collectionNodes: TreeSource<RawData, UserCollection>[] = collections.items.map((item) => ({
		data: item,
		id: item._id.toString(),
		parent: item.parent.$id.toString(),

		toNode(): TreeNode<UserCollection> {
			return new TreeNode(new UserCollection(raindrop, this.data));
		}
	}));
	const source: TreeSource<RawData, UserCollection>[] = groupNodes.concat(collectionNodes);
	source.sort(
		(a, b) =>
			(a.data?.title ?? '').localeCompare(b.data?.title ?? '') ||
			(a.data?._id ?? 0) - (b.data?._id ?? 0)
	);

	const rootNode = makeTree(this.Unsorted, source);
	return rootNode;
}

export type FetchGroupsResponse = {
	result: boolean;
	items: {
		_id: ID;
		title: string;
		description: string;
		user: {
			$ref: 'users';
			$id: UserID;
		};
		public: boolean;
		view: 'list' | 'simple' | 'grid' | 'masonry';
		count: NonNegativeInteger;
		cover: URLStr[];
		expanded: boolean;
		creatorRef: {
			_id: UserID;
			name: string;
			email: EmailStr;
		};
		lastAction: DateStr;
		created: DateStr;
		lastUpdate: DateStr;
		sort: Integer;
		slug: string;
		color?: RGBStr;
		access: {
			for: UserID;
			level: 1 | 2 | 3 | 4;
			root: boolean;
			draggable: boolean;
		};
		author: boolean;
	}[];
};

/**
 * Get root groups, top-most collection gathering.
 *
 * https://help.raindrop.io/collections/#groups
 * @returns Response body.
 */
export async function fetchGroups(this: CollectionManager): Promise<FetchGroupsResponse> {
	const { data } = await this.raindrop.client.get('/rest/v1/collections');

	return data;
}

export type FetchCollectionsResponse = {
	result: boolean;
	items: {
		_id: CollectionID;
		title: string;
		description: string;
		user: {
			$ref: 'users';
			$id: UserID;
		};
		parent: {
			$ref: 'collections';
			$id: CollectionID;
		};
		public: boolean;
		view: 'list' | 'simple' | 'grid' | 'masonry';
		count: NonNegativeInteger;
		cover: URLStr[];
		expanded: boolean;
		creatorRef: {
			_id: UserID;
			name: string;
			email: EmailStr;
		};
		lastAction: DateStr;
		created: DateStr;
		lastUpdate: DateStr;
		sort: Integer;
		slug: string;
		access: {
			for: ID;
			level: 1 | 2 | 3 | 4;
			root: boolean;
			draggable: boolean;
		};
		author: boolean;
	}[];
};

/**
 * Get all, flattened list of collections.
 * @returns Response body.
 */
export async function fetchCollections(this: CollectionManager): Promise<FetchCollectionsResponse> {
	const { data } = await this.raindrop.client.get('/rest/v1/collections/childrens');

	return data;
}

/* c8 ignore start */
if (import.meta.vitest) {
	const collections = await import('^/tests/fixtures/collections-childrens.json');
	const groups = await import('^/tests/fixtures/collections.json');
	const { default: axios, HttpStatusCode } = await import('axios');
	const { default: raindrop } = await import('~/lib/raindrop');
	const { describe, expect, it, vi } = import.meta.vitest;

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
}
/* c8 ignore stop */
