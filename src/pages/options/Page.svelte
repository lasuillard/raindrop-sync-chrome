<script lang="ts">
	import Heading from 'flowbite-svelte/Heading.svelte';
	import Hr from 'flowbite-svelte/Hr.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import '~/app.css';
	import Config from './Config.svelte';
	import ResourceView from './ResourceView.svelte';
	import TryIt from './TryIt.svelte';

	let version = '';
	chrome.management.getSelf().then((self) => {
		version = self.version;
	});
</script>

<main class="self-center mx-auto mt-3">
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
	<ResourceView />
</main>

<style>
	:root {
		padding: 1em;
	}
</style>
