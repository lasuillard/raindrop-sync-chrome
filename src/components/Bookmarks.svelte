<script lang="ts">
	import { generated, utils } from '@lasuillard/raindrop-client';
	import { Button, P } from 'flowbite-svelte';
	import Tree from '~/components/Tree.svelte';
	import { createBookmarks as _createBookmarks } from '~/lib/chrome/bookmark';
	import rd from '~/lib/raindrop';

	let treeNode: utils.tree.TreeNode<generated.Collection | null>;

	const fetchItems = async () => {
		treeNode = await rd.collection.getCollectionTree();
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
	<P data-testid="description">Bookmarks synchronization settings.</P>
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
