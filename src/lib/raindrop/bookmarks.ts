import type { Integer, NonNegativeInteger, PositiveInteger } from '~/lib/types';
import { ValidationError } from './errors';
import { Manager } from './manager';
import { Resource } from './resource';
import type { BookmarkID, CollectionID, DateStr, EmailStr, ID, URLStr, UserID } from './types';
import { SystemCollection } from './types';

export class BookmarkManager extends Manager {
	public getAllBookmarks = getAllBookmarks;
	public fetchBookmarks = fetchBookmarks;
}

type RawBookmarkData = FetchBookmarksResponse['items'][0];
type RawData = RawBookmarkData;

export class Bookmark extends Resource<RawData> {
	get id(): BookmarkID {
		return this.rawData._id;
	}

	get collectionID(): CollectionID {
		// NOTE: Duplicate field in `_data`: `$.items.collection.$id` and `$.items.collectionId`
		return this.rawData.collectionId;
	}

	get title(): string {
		return this.rawData.title;
	}

	get link(): string {
		return this.rawData.link;
	}
}

export interface GetAllBookmarksParams {
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
 * @param params Extra options; {@link GetAllBookmarksParams}.
 * @returns Response body.
 */
export async function getAllBookmarks(
	this: BookmarkManager,
	params?: GetAllBookmarksParams
): Promise<Bookmark[]> {
	const collection = params?.collection ?? SystemCollection.All;
	const pageSize = params?.pageSize ?? 50;

	// TODO: System collection support
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const unsorted = params?.unsorted ?? false;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const trash = params?.trash ?? false;

	const head = await this.fetchBookmarks({
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
		arr.map((page) => this.fetchBookmarks({ collection: 0, page, perpage: pageSize }))
	);

	// TODO: Extra fetch for collection "Unsorted" and "Trash"

	// Merge all result items into head
	for (const result of results) {
		head.items.push(...result.items);
	}

	return head.items.map((data) => new Bookmark(this.raindrop, data));
}

export interface FetchBookmarksParams {
	collection?: CollectionID;
	search?: string;
	sort?: 'created' | '-created' | 'score' | '-sort' | 'title' | '-title' | 'domain' | '-domain'; // NOTE: Not known well
	page: NonNegativeInteger;
	perpage: PositiveInteger;
}

export type FetchBookmarksResponse = {
	result: true;
	items: {
		_id: BookmarkID;
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
export async function fetchBookmarks(
	this: BookmarkManager,
	params: FetchBookmarksParams
): Promise<FetchBookmarksResponse> {
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
