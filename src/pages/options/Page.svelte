<script lang="ts">
	import Heading from 'flowbite-svelte/Heading.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import TabItem from 'flowbite-svelte/TabItem.svelte';
	import Tabs from 'flowbite-svelte/Tabs.svelte';
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
	<P class="mb-3" color="text-gray-600">v{version}</P>
	<Tabs>
		<TabItem open title="Bookmarks">
			<Bookmarks />
		</TabItem>
		<TabItem title="Try It">
			<TryIt />
		</TabItem>
		<TabItem title="Settings">
			<Config />
		</TabItem>
	</Tabs>
</main>

<style lang="postcss">
	:root {
		@apply mx-4 my-2 bg-slate-50;
	}
</style>
