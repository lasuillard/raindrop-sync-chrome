<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte';
	import Heading from 'flowbite-svelte/Heading.svelte';
	import Input from 'flowbite-svelte/Input.svelte';
	import Label from 'flowbite-svelte/Label.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import Textarea from 'flowbite-svelte/Textarea.svelte';
	import raindrop from '~/lib/raindrop';

	let query = '';
	let queryResult: unknown = null;
	$: queryResultJSON = JSON.stringify(queryResult, null, 4);

	/** Send query to fetch raindrops. */
	async function sendQuery() {
		const result = await raindrop.bookmarks.fetchBookmarks({
			collection: 0,
			search: query,
			page: 0,
			perpage: 5
		});
		queryResult = result;
	}
</script>

<div>
	<Heading data-testid="heading" class="mt-2" tag="h2" customSize="text-xl font-bold"
		>Try It</Heading
	>
	<P data-testid="description" class="mt-2">Try Raindrop queries.</P>
	<div class="mt-4">
		<div>
			<Label for="query">Query</Label>
			<ButtonGroup class="w-full">
				<Input
					data-testid="query/input"
					id="query"
					type="text"
					placeholder="#python #dev:tools"
					bind:value={query}
				/>
				<Button data-testid="query/send-button" on:click={sendQuery}>Send</Button>
			</ButtonGroup>
		</div>
		<Textarea
			data-testid="query/result"
			disabled
			unWrappedClass="mt-2"
			bind:value={queryResultJSON}
			rows="20"
		/>
	</div>
</div>
