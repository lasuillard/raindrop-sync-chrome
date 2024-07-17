<script lang="ts">
	import BookmarkOutline from 'flowbite-svelte-icons/BookmarkOutline.svelte';
	import QuestionCircleOutline from 'flowbite-svelte-icons/QuestionCircleOutline.svelte';
	import SearchOutline from 'flowbite-svelte-icons/SearchOutline.svelte';
	import UserSettingsOutline from 'flowbite-svelte-icons/UserSettingsOutline.svelte';
	import TabItem from 'flowbite-svelte/TabItem.svelte';
	import Tabs from 'flowbite-svelte/Tabs.svelte';
	import '~/app.css';
	import About from '~/components/About.svelte';
	import Bookmarks from '~/components/Bookmarks.svelte';
	import Config from '~/components/Config.svelte';
	import TryIt from '~/components/TryIt.svelte';
</script>

<main class="mx-1 mt-4 self-center">
	<Tabs style="underline">
		<TabItem open>
			<div slot="title" class="flex items-center gap-2">
				<BookmarkOutline size="sm" class="focus:outline-none" />
				Bookmarks
			</div>
			<Bookmarks />
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<SearchOutline size="sm" class="focus:outline-none" />
				Try It
			</div>
			<TryIt />
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<UserSettingsOutline size="sm" class="focus:outline-none" />
				Settings
			</div>
			<Config />
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<QuestionCircleOutline size="sm" class="focus:outline-none" />
				About
			</div>
			<About />
		</TabItem>
	</Tabs>
</main>

<style lang="postcss">
	:root {
		@apply mx-4 my-2 bg-slate-50;
	}
</style>
