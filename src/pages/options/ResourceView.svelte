<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import Heading from 'flowbite-svelte/Heading.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import raindrop from '~/lib/raindrop';
	import type { Collection } from '~/lib/raindrop/collections';
	import type { TreeNode } from '~/lib/tree';
	import Tree from './Tree.svelte';

	let treeNode: TreeNode<Collection> | null = null;

	const loadItems = async () => {
		treeNode = await raindrop.collections.getCollectionTree();
	};
</script>

<div>
	<Heading data-testid="heading" class="mt-2" tag="h2" customSize="text-xl font-bold"
		>Synchronization</Heading
	>
	<P data-testid="description" class="mt-2">Bookmarks synchronization settings.</P>
	<Button class="mt-2" size="sm" color="alternative" on:click={loadItems}>Load items</Button>
	<div class="p-2 mt-2">
		{#if treeNode}
			<Tree {treeNode}></Tree>
		{:else}
			<P>No data received yet</P>
		{/if}
	</div>
</div>
