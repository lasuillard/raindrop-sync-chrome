<script lang="ts">
	import { get } from 'svelte/store';
	import db from '~/core/db';
	import * as stores from '~/core/stores';
	import raindrop from '~/lib/raindrop';
	import type { FetchUserInfoResponse } from '~/lib/raindrop/user';

	/**
	 * Launch web auth flow.
	 */
	async function launchWebAuthFlow() {
		const { accessToken, refreshToken } = await raindrop.auth.launchWebAuthFlow({
			clientID: get(stores.clientID),
			clientSecret: get(stores.clientSecret)
		});
		stores.accessToken.set(accessToken);
		stores.refreshToken.set(refreshToken);
	}

	let userInfo: FetchUserInfoResponse | null = null;

	/**
	 * Load user info.
	 */
	async function loadUserInfo() {
		userInfo = await raindrop.user.fetchUserInfo();
	}

	let query = '';
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let queryResult: any = {};

	/**
	 * Send query.
	 */
	async function sendQuery() {
		const result = await raindrop.raindrops.fetchRaindrops({
			collection: 0,
			search: query,
			page: 0,
			perpage: 5
		});
		const items = result.items.map((item) => ({
			...item,
			$table: 'raindrop',
			_id: item._id.toString()
		}));
		console.log(items);
		db.bulkDocs(items);
	}

	/**
	 * Fetch collection structure.
	 */
	async function getCollectionStructure() {
		const data = await db.find({
			selector: {
				$table: 'raindrop'
			}
		});
		console.log('DONE', data);
		queryResult = data;
	}
</script>

<main>
	<h1>Welcome to SvelteKit (popup)</h1>
	<!-- svelte-ignore missing-declaration -->
	<button
		on:click={() => {
			chrome.runtime.openOptionsPage();
		}}>Options</button
	>
	<button on:click={launchWebAuthFlow}>Register</button>
	<button on:click={loadUserInfo}>Load User Info</button>
	<button on:click={getCollectionStructure}>Get Collection Structure</button>
	<div>
		<label class="text-lg" for="query">Query</label>
		<input id="query" bind:value={query} />
		<button on:click={sendQuery}>Query</button>
		<p>Result</p>
		{#each queryResult?.docs || [] as item}
			<p>{item?.title || 'no title'}: {item?.link || 'empty'}</p>
		{/each}
	</div>

	<p>
		{userInfo?.user?.fullName || 'notset'}
	</p>
</main>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.200);
	}
</style>
