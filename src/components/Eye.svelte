<script lang="ts">
	import { EyeSlashSolid, EyeSolid } from 'flowbite-svelte-icons';

	export let open = false;
	export let size: 'sm' | 'xs' | 'md' | 'lg' | 'xl' = 'sm';
</script>

<button data-testid="eye" class="focus:outline-none" type="button" on:click {...$$restProps}>
	{#if open}
		<EyeSolid data-testid="eye-open" {size} />
	{:else}
		<EyeSlashSolid data-testid="eye-closed" {size} />
	{/if}
</button>
