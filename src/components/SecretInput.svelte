<script lang="ts">
	import { FloatingLabelInput } from 'flowbite-svelte';
	import { EyeSlashSolid, EyeSolid } from 'flowbite-svelte-icons';
	import type { Writable } from 'svelte/store';

	export let boundStore: Writable<unknown>;
	let showSecret = false;
</script>

<div class="flex">
	<FloatingLabelInput
		classDiv="w-full mr-2"
		type={showSecret ? 'text' : 'password'}
		required
		bind:value={$boundStore}
	>
		<slot />
	</FloatingLabelInput>

	<button
		class="focus:outline-none"
		type="button"
		on:click={() => {
			showSecret = !showSecret;
		}}
	>
		{#if showSecret}
			<EyeSolid size="sm" />
		{:else}
			<EyeSlashSolid size="sm" />
		{/if}
	</button>
</div>
