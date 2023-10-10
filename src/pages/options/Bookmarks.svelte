<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import Heading from 'flowbite-svelte/Heading.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import raindrop from '~/lib/raindrop';
	import type { Collection } from '~/lib/raindrop/collections';
	import type { TreeNode } from '~/lib/tree';
	import Tree from './Tree.svelte';

	let treeNode: TreeNode<Collection> | null = null;

	const fetchItems = async () => {
		treeNode = await raindrop.collections.getCollectionTree();
	};

	const syncBookmarks = async () => {
		if (!treeNode) {
			console.log('Data not loaded yet');
			return;
		}

		const bookmarksTree = await chrome.bookmarks.getTree();
		const [bookmarksBar, otherBookmarks] = bookmarksTree[0].children!;

		const dummyRoot = await chrome.bookmarks.create({
			parentId: bookmarksBar.id,
			title: 'Dummy'
		});

		async function createBookmarks(parentId: string, rootCollections: TreeNode<Collection>[]) {
			// Ignore root
			for (const collection of rootCollections) {
				const result = await chrome.bookmarks.create({
					parentId,
					title: collection.data?.title || 'No Title'
				});
				const raindrops = (await collection.data?.getRaindrops()) ?? [];
				raindrops.forEach((rd) => {
					chrome.bookmarks.create({
						parentId: result.id,
						title: rd.title,
						url: rd.link
					});
				});
				await createBookmarks(result.id, collection.children);
			}
		}

		await createBookmarks(dummyRoot.id, treeNode.children);
	};
</script>

<div>
	<Heading data-testid="heading" class="mt-2" tag="h2" customSize="text-xl font-bold">
		Bookmarks
	</Heading>
	<P data-testid="description" class="mt-2">Bookmarks synchronization settings.</P>
	<div class="space-x-2 mt-2">
		<Button outline on:click={fetchItems}>Fetch</Button>
		<Button outline on:click={syncBookmarks}>Synchronize</Button>
	</div>
	<div class="p-2 mt-2">
		{#if treeNode}
			<Tree {treeNode}></Tree>
		{:else}
			<P>No data received yet</P>
		{/if}
	</div>
</div>
