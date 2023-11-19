<script lang="ts">
	import BookmarkOutline from 'flowbite-svelte-icons/BookmarkOutline.svelte';
	import SearchOutline from 'flowbite-svelte-icons/SearchOutline.svelte';
	import UserSettingsOutline from 'flowbite-svelte-icons/UserSettingsOutline.svelte';
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

<main class="mx-1 mt-4 self-center">
	<Heading class="mb-2" tag="h1" customSize="text-3xl font-extrabold" color="text-gray-600"
		>Raindrop Sync for Chrome</Heading
	>
	<P class="mb-10 ml-1" size="xl" color="text-gray-400">v{version}</P>
	<Tabs style="underline">
		<TabItem open>
			<div slot="title" class="flex items-center gap-2">
				<BookmarkOutline size="sm" />
				Bookmarks
			</div>
			<Bookmarks />
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<SearchOutline size="sm" />
				Try It
			</div>
			<TryIt />
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<UserSettingsOutline size="sm" />
				Settings
			</div>
			<Config />
		</TabItem>
	</Tabs>
</main>

<style lang="postcss">
	:root {
		@apply mx-4 my-2 bg-slate-50;
	}
</style>
