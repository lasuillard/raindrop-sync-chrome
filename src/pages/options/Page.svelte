<script lang="ts">
	import { TabItem, Tabs } from 'flowbite-svelte';
	import {
		BookmarkOutline,
		QuestionCircleOutline,
		SearchOutline,
		UserSettingsOutline
	} from 'flowbite-svelte-icons';
	import '~/app.css';
	import Message from '~/components/Message.svelte';
	import { messageBox } from '~/lib/messages';
	import About from './About.svelte';
	import Bookmarks from './Bookmarks.svelte';
	import Config from './Config.svelte';
	import TryIt from './TryIt.svelte';
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

	<!-- Global message box -->
	<div class="fixed right-6 top-6 space-y-2">
		{#each Object.entries($messageBox) as [id, message] (id)}
			<Message {message} />
		{/each}
	</div>
</main>

<style lang="postcss">
	:root {
		@apply mx-4 my-2 bg-slate-50;
	}
</style>
