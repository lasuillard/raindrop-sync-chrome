<script lang="ts">
	import { generated, utils } from '@lasuillard/raindrop-client';
	import { Li, List } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import rd from '~/lib/raindrop';

	export let treeNode: utils.tree.TreeNode<generated.Collection | null>;
	let raindrops: generated.GetRaindropResponseItem[] = [];
	let nodeTitle = treeNode.data?.slug || 'no-title';

	onMount(async () => {
		// If root, data likely to be `null`
		const collectionId = treeNode.data?._id || -1;
		raindrops = await rd.raindrop.getAllRaindrops(collectionId);
	});
</script>

<List tag="ul">
	<Li>
		&lt;Directory&gt; {nodeTitle}
		{#if treeNode.children.length > 0}
			<List tag="ul" class="mt-2 space-y-1 pl-5">
				{#each treeNode.children as child (child.data?._id)}
					<svelte:self treeNode={child} />
				{/each}
			</List>
		{/if}
		{#if raindrops}
			<List tag="ul" class="mt-2 space-y-1 pl-5">
				{#each raindrops as raindrop (raindrop._id)}
					<Li>{raindrop.title}</Li>
				{/each}
			</List>
		{/if}
	</Li>
</List>
