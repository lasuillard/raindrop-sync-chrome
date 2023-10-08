import { TreeNode, makeTree, type TreeSource } from '~/lib/tree';
import type { Integer, NonNegativeInteger } from '~/lib/types';
import { Manager } from './manager';
import type { Raindrop } from './raindrops';
import { Resource } from './resource';
import type { CollectionID, DateStr, EmailStr, ID, RGBStr, URLStr, UserID } from './types';

export class CollectionManager extends Manager {
	public getCollectionTree = getCollectionTree;
	public fetchGroups = fetchGroups;
	public fetchCollections = fetchCollections;
}

type RawGroupData = FetchGroupsResponse['items'][0];
type RawCollectionData = FetchCollectionsResponse['items'][0];
type RawData = RawGroupData | RawCollectionData;

export class Collection extends Resource<RawData> {
	get id(): CollectionID {
		return this.rawData._id;
	}

	/**
	 * Helper method loading raindrops of this collection.
	 * @returns Array of raindrops in this collection.
	 */
	async getRaindrops(): Promise<Raindrop[]> {
		return await this.raindrop.raindrops.getAllRaindrops({
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
	const groupNodes: TreeSource<RawData, Collection>[] = groups.items.map((item) => ({
		data: item,
		id: item._id.toString(),
		parent: null,

		toNode(): TreeNode<Collection> {
			return new TreeNode(new Collection(raindrop, this.data));
		}
	}));
	const collectionNodes: TreeSource<RawData, Collection>[] = collections.items.map((item) => ({
		data: item,
		id: item._id.toString(),
		parent: item.parent.$id.toString(),

		toNode(): TreeNode<Collection> {
			return new TreeNode(new Collection(raindrop, this.data));
		}
	}));
	const source: TreeSource<RawData, Collection>[] = groupNodes.concat(collectionNodes);
	source.sort(
		(a, b) =>
			(a.data?.title ?? '').localeCompare(b.data?.title ?? '') ||
			(a.data?._id ?? 0) - (b.data?._id ?? 0)
	);

	const rootNode = makeTree(source);
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
