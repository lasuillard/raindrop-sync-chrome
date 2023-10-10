<script lang="ts">
	import A from 'flowbite-svelte/A.svelte';
	import P from 'flowbite-svelte/P.svelte';
</script>

<main class="w-64 mx-1 my-3 flex flex-col">
	<P class="font-semibold text-lg text-center">Raindrop Sync for Chrome</P>
	<div class="w-full h-64">
		<!-- TODO: Sync button with icon -->
	</div>
	<div class="mt-2 flex justify-end">
		<!-- FIXME: How to let Svelte know this is Chrome Extension? -->
		<!-- svelte-ignore missing-declaration -->
		<A on:click={() => chrome.runtime.openOptionsPage()}>Options</A>
	</div>
</main>

<style lang="postcss">
	:root {
		@apply bg-slate-50 mx-2 my-1;
	}
</style>
