/**
 * See API spec at https://developer.raindrop.io/
 *
 * NOTE: API documentation looks outdated, there are gaps between API specification
 *       and actual response data; here we try make type annotations from latter data format first
 */
import type { AxiosInstance } from 'axios';
import { AuthManager } from './auth';
import { defaultClient } from './client';
import { CollectionManager } from './collections';
import { RaindropManager } from './raindrops';
import { UserManager } from './user';

/**
 * Raindrop service.
 */
export class Raindrop {
	public readonly client: AxiosInstance;

	// API namespaces
	public readonly auth: AuthManager;
	public readonly user: UserManager;
	public readonly raindrops: RaindropManager;
	public readonly collections: CollectionManager;

	constructor(client?: AxiosInstance) {
		this.client = client ?? defaultClient;
		this.auth = new AuthManager(this);
		this.user = new UserManager(this);
		this.raindrops = new RaindropManager(this);
		this.collections = new CollectionManager(this);
	}
}

export default new Raindrop();
