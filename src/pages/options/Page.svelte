<script lang="ts">
	import Heading from 'flowbite-svelte/Heading.svelte';
	import Hr from 'flowbite-svelte/Hr.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import '~/app.css';
	import Bookmarks from '~/components/Bookmarks.svelte';
	import Config from '~/components/Config.svelte';
	import TryIt from '~/components/TryIt.svelte';

	let version = '';
	chrome.management.getSelf().then((self) => {
		version = self.version;
	});
</script>

<main class="mx-auto mt-3 self-center">
	<Heading class="mb-2" tag="h1" customSize="text-3xl font-extrabold" color="text-gray-600"
		>Raindrop Sync for Chrome</Heading
	>
	<P color="text-gray-600">v{version}</P>

	<!-- TODO: Sidebar menu for switching views -->
	<Hr />
	<Config />
	<Hr />
	<TryIt />
	<Hr />
	<Bookmarks />
</main>

<style lang="postcss">
	:root {
		@apply mx-4 my-2 bg-slate-50;
	}
</style>
