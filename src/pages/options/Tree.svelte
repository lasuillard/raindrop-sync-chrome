<script lang="ts">
	import Li from 'flowbite-svelte/Li.svelte';
	import List from 'flowbite-svelte/List.svelte';
	import { onMount } from 'svelte';
	import type { Collection } from '~/lib/raindrop/collections';
	import type { Raindrop } from '~/lib/raindrop/raindrops';
	import type { TreeNode } from '~/lib/tree';

	export let treeNode: TreeNode<Collection>;
	let raindrops: Raindrop[];

	onMount(async () => {
		raindrops = (await treeNode.data?.getRaindrops()) ?? [];
	});
</script>

<List tag="ul">
	<Li
		>&lt;Directory&gt; {treeNode.data?.rawData.slug || 'No title'}
		{#if treeNode.children.length > 0}
			<List tag="ul" class="pl-5 mt-2 space-y-1">
				{#each treeNode.children as child}
					<svelte:self treeNode={child} />
				{/each}
			</List>
		{/if}
		{#if raindrops}
			<List tag="ul" class="pl-5 mt-2 space-y-1">
				{#each raindrops as raindrop}
					<Li>{raindrop.rawData.title}</Li>
				{/each}
			</List>
		{/if}
	</Li>
</List>
