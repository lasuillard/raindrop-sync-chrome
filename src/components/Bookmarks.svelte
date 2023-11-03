<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import Heading from 'flowbite-svelte/Heading.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import Tree from '~/components/Tree.svelte';
	import { createBookmarks as _createBookmarks } from '~/lib/chrome/bookmark';
	import raindrop from '~/lib/raindrop';
	import type { Collection } from '~/lib/raindrop/collections';
	import type { TreeNode } from '~/lib/tree';

	let treeNode: TreeNode<Collection> | null = null;

	const fetchItems = async () => {
		treeNode = await raindrop.collections.getCollectionTree();
	};

	const createBookmarks = async () => {
		if (!treeNode) {
			console.log('Data not loaded yet');
			return;
		}

		const bookmarksTree = await chrome.bookmarks.getTree();

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
		const [bookmarksBar, otherBookmarks] = bookmarksTree[0].children!;

		// FIXME: For testing purpose; once implementation get stabilized, remove dummy
		const dummyRoot = await chrome.bookmarks.create({
			parentId: bookmarksBar.id,
			title: 'RSFC'
		});

		await _createBookmarks(dummyRoot.id, treeNode);
	};
</script>

<div>
	<Heading data-testid="heading" class="mt-2" tag="h2" customSize="text-xl font-bold">
		Bookmarks
	</Heading>
	<P data-testid="description" class="mt-2">Bookmarks synchronization settings.</P>
	<div class="mt-2 space-x-2">
		<Button outline on:click={fetchItems}>Fetch</Button>
		<Button outline on:click={createBookmarks}>Synchronize</Button>
	</div>
	<div class="mt-2 p-2">
		{#if treeNode}
			<Tree {treeNode}></Tree>
		{:else}
			<P>No data received yet</P>
		{/if}
	</div>
</div>
