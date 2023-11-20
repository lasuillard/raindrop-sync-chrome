import type { Integer, NonNegativeInteger } from '~/lib/types';
import { Manager } from './manager';
import type { CollectionID, DateStr, EmailStr, LangStr, URLStr, UserID } from './types';

export class UserManager extends Manager {
	public fetchUserInfo = fetchUserInfo;
}

export type FetchUserInfoResponse = {
	result: boolean;
	user: {
		tfa: {
			enabled: boolean;
		};
		files: {
			used: NonNegativeInteger;
			size: NonNegativeInteger;
			lastCheckPoint: DateStr;
		};
		_id: UserID;
		avatar: URLStr;
		pro: boolean;
		fullName: string;
		email: EmailStr;
		provider: 'google'; // NOTE: Other providers exist, but unknown
		google: {
			enabled: boolean;
		};
		groups: {
			title: string;
			hidden: boolean;
			sort: Integer;
			collections: CollectionID[];
		}[];
		lastAction: DateStr;
		lastVisit: DateStr;
		name: string;
		registered: DateStr;
		lastUpdate: DateStr;
		config: {
			raindrops_view: 'grid' | 'list' | 'simple' | 'masonry';
			raindrops_hide: ('simple_excerpt' | string)[]; // NOTE: Unknown
			raindrops_buttons: ('select' | 'new_tab' | 'preview' | 'edit' | 'remove' | string)[]; // NOTE: Unknown
			raindrops_search_by_score: boolean;
			raindrops_search_incollection: boolean;
			broken_level: 'basic' | 'default' | 'strict' | 'off';
			font_size: NonNegativeInteger;
			add_default_collection: CollectionID; // NOTE: Unknown
			acknowledge: unknown[];
			lang: LangStr;
			filters_hide: boolean;
			raindrops_list_cover_right: boolean;
			tags_hide: boolean;
			raindrops_sort:
				| 'title'
				| '-title'
				| '-sort'
				| 'domain'
				| '-domain'
				| '+lastUpdate'
				| '-lastUpdate'
				| '-created';
			tags_sort: '_id' | string; // NOTE: Unknown
			default_collection_view: 'list' | 'simple' | 'grid' | 'masonry';
			last_collection: CollectionID;
		};
	};
};

/**
 * Get current user information.
 * @returns Response body.
 */
export async function fetchUserInfo(this: UserManager): Promise<FetchUserInfoResponse> {
	const { data } = await this.raindrop.client.get('/rest/v1/user');

	return data;
}

/* c8 ignore start */
if (import.meta.vitest) {
	const user = await import('^/tests/fixtures/user.json');
	const { default: axios, HttpStatusCode } = await import('axios');
	const { default: raindrop } = await import('~/lib/raindrop');
	const { describe, expect, it, vi } = import.meta.vitest;

	describe(raindrop.user.fetchUserInfo, () => {
		it('retrieve data from Raindrop API', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				status: HttpStatusCode.Ok,
				data: user
			});

			const result = await raindrop.user.fetchUserInfo();

			expect(axios.get).toHaveBeenCalledWith('/rest/v1/user');
			expect(result).toEqual(user);
		});
	});
}
/* c8 ignore stop */
