/**
 * See API spec at https://developer.raindrop.io/
 *
 * NOTE: API documentation looks outdated, there are gaps between API specification
 *       and actual response data; here we try make type annotations from latter data format first
 */
import type { AxiosInstance } from 'axios';
import { AuthManager } from './auth';
import { BookmarkManager } from './bookmarks';
import { getClient } from './client';
import { CollectionManager } from './collections';
import { UserManager } from './user';

/**
 * Raindrop service.
 */
export class Raindrop {
	public readonly client: AxiosInstance;

	// API namespaces
	public readonly auth: AuthManager;
	public readonly user: UserManager;
	public readonly bookmarks: BookmarkManager;
	public readonly collections: CollectionManager;

	constructor(client?: AxiosInstance) {
		this.client = client ?? getClient();
		this.auth = new AuthManager(this);
		this.user = new UserManager(this);
		this.bookmarks = new BookmarkManager(this);
		this.collections = new CollectionManager(this);
	}
}

export default new Raindrop();

/* c8 ignore start */
if (import.meta.vitest) {
	const { it } = import.meta.vitest;

	it.todo('nothing to test yet');
}
/* c8 ignore stop */
