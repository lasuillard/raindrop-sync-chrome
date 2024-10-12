<script lang="ts">
	import { Button, Heading, P, Radio, Range, Toggle } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import SecretInput from '~/components/SecretInput.svelte';
	import { putMessage } from '~/lib/messages';
	import { launchWebAuthFlow as _launchWebAuthFlow } from '~/lib/raindrop/auth';
	import {
		accessToken,
		autoSyncEnabled,
		autoSyncExecOnStartup,
		autoSyncIntervalInMinutes,
		clientID,
		clientSecret,
		refreshToken,
		syncLocation
	} from '~/lib/settings';

	const launchWebAuthFlow = async () => {
		try {
			const result = await _launchWebAuthFlow({
				clientID: get(clientID),
				clientSecret: get(clientSecret)
			});
			accessToken.set(result.accessToken);
			refreshToken.set(result.refreshToken);
			putMessage({ type: 'success', message: 'Successfully authorized app.' });
		} catch (err) {
			console.error('Failed to authorize app:', err);
			putMessage({ type: 'error', message: String(err) });
		}
	};

	let bookmarkFolders: {
		id: string;
		title: string;
		depth: number;
	}[] = [];

	onMount(async () => {
		const bookmarksTree = (await chrome.bookmarks.getTree()) || [];
		if (!bookmarksTree[0]?.children) {
			putMessage({ type: 'error', message: 'No bookmark folders found.' });
			console.error('No bookmark folders found.');
			return;
		}

		const dfs = (arr: chrome.bookmarks.BookmarkTreeNode[], depth: number = 0) => {
			for (let i = 0; i < arr.length; i++) {
				if (depth != 0 /* Ignore virtual root */) {
					bookmarkFolders.push({ id: arr[i].id, title: arr[i].title, depth });
				}
				if (arr[i].children) {
					dfs(arr[i].children ?? [], depth + 1);
				}
			}
		};

		dfs(bookmarksTree);

		// Force trigger reactivity
		bookmarkFolders = bookmarkFolders;
	});
</script>

<div>
	<div class="grid grid-cols-1">
		<Heading tag="h4">Application</Heading>
		<div class="mt-6 grid grid-flow-row grid-cols-1 gap-x-4 gap-y-6">
			<P></P>
			<SecretInput boundStore={clientID}>Client ID</SecretInput>
			<SecretInput boundStore={clientSecret}>Client Secret</SecretInput>
			<SecretInput boundStore={accessToken}>Access Token</SecretInput>
			<SecretInput boundStore={refreshToken}>Refresh Token</SecretInput>
			<P>
				<!-- TODO: More detailed guide registering application with pictures -->
				To register your application, fill <b>Client ID</b> and <b>Client Secret</b> then click
				<b>Register</b>. Or, directly fill your test token in <b>Access Token</b> directly.
			</P>
			<Button outline on:click={launchWebAuthFlow}>Register</Button>
		</div>
		<div class="mt-6 grid grid-flow-row grid-cols-1 gap-x-4 gap-y-6">
			<Heading tag="h4">Sync</Heading>
			<!-- TODO: Re-schedule alarm on changes -->
			<Toggle bind:checked={$autoSyncEnabled}>AutoSync</Toggle>
			<Toggle bind:checked={$autoSyncExecOnStartup}>AutoSync on Startup</Toggle>
			<div>
				<Range bind:value={$autoSyncIntervalInMinutes} min="1" max="60" />
				<P size="sm" align="center">Sync every {$autoSyncIntervalInMinutes} minutes</P>
			</div>
			<div>
				<Heading tag="h5">Sync Location</Heading>
				<P color="text-red-700" size="sm">
					Existing bookmarks in sync target folder will be lost each time sync run!
				</P>
				<div class="mt-2">
					{#each bookmarkFolders as bf}
						<div style="margin-left: {6 * 0.25 * (bf.depth - 1)}rem;" class="my-1">
							<Radio name="sync-location" bind:group={$syncLocation} value={bf.id}>
								{bf.title}
							</Radio>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<!-- TODO: Debug actions: check token validity, force refresh token, etc. -->
	</div>
</div>
