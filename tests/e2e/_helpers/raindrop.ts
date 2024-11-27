/* eslint-disable jsdoc/require-jsdoc */
import type { generated } from '@lasuillard/raindrop-client';
import * as rd from '@lasuillard/raindrop-client';
import type { Use } from '@vitest/runner';
import { type AxiosInstance } from 'axios';
import type { RunnerTask } from 'vitest';

// Aliases
const { Raindrop } = rd.client;
type Raindrop = rd.client.Raindrop;

const { Configuration } = rd.generated;

export async function client(
	{ axiosInstance }: { axiosInstance: AxiosInstance },
	use: Use<Raindrop>
) {
	const accessToken = process.env.RAINDROP_API_TOKEN;
	const _client = new Raindrop(new Configuration({ accessToken }), axiosInstance);
	await use(_client);
}

export async function resetData({ client }: { client: Raindrop }, use: Use<void>) {
	console.debug('Resetting data');

	// Remove all collections
	const { data } = await client.collection.getRootCollections();
	const collectionIds = data.items.map((item) => item._id);
	await client.collection.removeCollections({ ids: collectionIds });

	// Remove unsorted raindrops
	await client.raindrop.removeRaindrops(0);

	await use();
}

// Shortcut for setup utilities
export async function setupTools(
	{ task, client }: { task: RunnerTask; client: Raindrop },
	use: Use<SetupTools>
) {
	const setupTool = new SetupTools(task, client);
	await use(setupTool);
}

export class SetupTools {
	task: RunnerTask;
	client: Raindrop;

	constructor(task: RunnerTask, client: Raindrop) {
		this.task = task;
		this.client = client;
	}

	// Helper function to create collection
	async createCollection(
		args?: Partial<generated.CreateCollectionRequest>
	): Promise<generated.CreateCollectionResponse> {
		const response = await this.client.collection.createCollection({
			view: 'list',
			title: this.task.name,
			sort: 0,
			public: false,
			parent: {
				$ref: 'collections',
				$id: 0,
				oid: 0
			},
			cover: [],
			...(args || {})
		});
		return response.data;
	}

	// Helper function to create raindrop
	async createRaindrop(
		args?: Partial<generated.CreateRaindropRequest>
	): Promise<generated.CreateRaindropResponse> {
		const response = await this.client.raindrop.createRaindrop({
			title: this.task.name,
			link: 'https://raindrop.io',
			...(args || {})
		});
		return response.data;
	}
}
