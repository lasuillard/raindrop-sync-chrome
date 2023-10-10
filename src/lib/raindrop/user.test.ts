import user from '^/tests/fixtures/user.json';
import axios, { HttpStatusCode } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import raindrop from '~/lib/raindrop';

describe(raindrop.user.fetchUserInfo.name, () => {
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
