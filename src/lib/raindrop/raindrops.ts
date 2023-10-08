import type { Integer, NonNegativeInteger, PositiveInteger } from '~/lib/types';
import { ValidationError } from './errors';
import { Manager } from './manager';
import { Resource } from './resource';
import type { CollectionID, DateStr, EmailStr, ID, RaindropID, URLStr, UserID } from './types';
import { SystemCollection } from './types';

export class RaindropManager extends Manager {
	public getAllRaindrops = getAllRaindrops;
	public fetchRaindrops = fetchRaindrops;
}

type RawRaindropData = FetchRaindropsResponse['items'][0];
type RawData = RawRaindropData;

export class Raindrop extends Resource<RawData> {
	get id(): RaindropID {
		return this.rawData._id;
	}

	get collectionID(): CollectionID {
		// NOTE: Duplicate field in `_data`: `$.items.collection.$id` and `$.items.collectionId`
		return this.rawData.collectionId;
	}
}

export interface GetAllRaindropsParams {
	/** ID of collection. */
	collection?: CollectionID;

	/** Size of items per pages to make API call. DO NOT CHANGE this value unless it is certainly necessary. */
	pageSize?: PositiveInteger;

	/** Whether to include `"Unsorted"` system collection. */
	unsorted?: boolean;

	/** Whether to include `"Trash"` system collection. */
	trash?: boolean;
}

/**
 * Fetch all raindrops of all collections.
 * @param params Extra options; {@link GetAllRaindropsParams}.
 * @returns Response body.
 */
export async function getAllRaindrops(
	this: RaindropManager,
	params?: GetAllRaindropsParams
): Promise<Raindrop[]> {
	const collection = params?.collection ?? SystemCollection.All;
	const pageSize = params?.pageSize ?? 50;

	// TODO: System collection support
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const unsorted = params?.unsorted ?? false;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const trash = params?.trash ?? false;

	const head = await this.fetchRaindrops({
		collection,
		page: 0,
		perpage: pageSize
	});

	// NOTE: `count` property is full count of collection, not search result (bug or intended?)
	const count = head.count;
	const maxPage = Math.ceil(count / pageSize);

	// Fetch data in parallel
	const arr = Array.from(Array(maxPage).keys());
	arr.shift(); // 0 is head request already done

	const results = await Promise.all(
		arr.map((page) => this.fetchRaindrops({ collection: 0, page, perpage: pageSize }))
	);

	// TODO: Extra fetch for collection "Unsorted" and "Trash"

	// Merge all result items into head
	for (const result of results) {
		head.items.push(...result.items);
	}

	return head.items.map((data) => new Raindrop(this.raindrop, data));
}

export interface FetchRaindropsParams {
	collection?: CollectionID;
	search?: string;
	sort?: 'created' | '-created' | 'score' | '-sort' | 'title' | '-title' | 'domain' | '-domain'; // NOTE: Not known well
	page: NonNegativeInteger;
	perpage: PositiveInteger;
}

export type FetchRaindropsResponse = {
	result: true;
	items: {
		_id: RaindropID;
		link: string;
		title: string;
		excerpt: string;
		note: string;
		type: 'link' | 'article' | 'image' | 'video' | 'document' | 'audio';
		user: {
			$ref: 'users';
			$id: UserID;
		};
		cover: URLStr;
		media: {
			link: URLStr;
			type: 'image'; // NOTE: Other types aren't known
		}[];
		tags: string[];
		important: boolean;
		reminder: {
			date: unknown;
		};
		removed: boolean;
		created: DateStr;
		lastUpdate: DateStr;
		collection: {
			$ref: 'collections';
			$id: CollectionID;
			oid: CollectionID;
		};
		highlights: unknown[];
		domain: string;
		creatorRef: {
			_id: ID;
			avatar: URLStr;
			name: string;
			email: EmailStr;
		};
		sort: Integer;
		collectionId: CollectionID;
		highlight: {
			excerpt: string;
		};
	}[];
	count: NonNegativeInteger;
	collectionId: CollectionID;
};

/**
 * Get raindrops matching conditions.
 *
 * https://developer.raindrop.io/v1/raindrops/multiple
 * @param params API query parameters.
 * @returns Response body.
 */
export async function fetchRaindrops(
	this: RaindropManager,
	params: FetchRaindropsParams
): Promise<FetchRaindropsResponse> {
	const collection = params.collection ?? 0;
	const search = params.search ?? '';
	const sort = params.sort ?? '';
	const { page, perpage } = params;

	if (sort == 'score' && !search) {
		throw new ValidationError(
			'`sort` option `"score"` can be used only if `search` query is not empty'
		);
	}

	const { data } = await this.raindrop.client.get(`/rest/v1/raindrops/${collection}`, {
		params: {
			search: search ?? '',
			sort: sort ?? '',
			page,
			perpage
		}
	});
	return data;
}
