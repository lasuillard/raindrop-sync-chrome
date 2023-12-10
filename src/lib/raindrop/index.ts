/**
 * See API spec at https://developer.raindrop.io/
 *
 * NOTE: API documentation looks outdated, there are gaps between API specification
 *       and actual response data; here we try make type annotations from latter data format first
 */
import { getClient } from './client';

export default getClient();

/* c8 ignore start */
if (import.meta.vitest) {
	const { it } = import.meta.vitest;

	it.todo('nothing to test yet');
}
/* c8 ignore stop */
