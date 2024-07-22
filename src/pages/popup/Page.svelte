<script lang="ts">
	import { A, P } from 'flowbite-svelte';

	const openOptionsPage = () => chrome.runtime.openOptionsPage();
</script>

<main class="mx-1 my-3 flex w-64 flex-col">
	<P class="text-center text-lg font-semibold">Raindrop Sync for Chrome</P>
	<div class="h-64 w-full">
		<!-- TODO: Sync button with icon -->
	</div>
	<div class="mt-2 flex justify-end">
		<A on:click={openOptionsPage}>Options</A>
	</div>
</main>

<style lang="postcss">
	:root {
		@apply mx-2 my-1 bg-slate-50;
	}
</style>
