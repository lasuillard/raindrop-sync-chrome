<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import {
		CheckCircleSolid,
		CloseCircleSolid,
		ExclamationCircleSolid
	} from 'flowbite-svelte-icons';
	import type { ComponentType } from 'svelte';
	import { dismissMessage, type Message } from '~/lib/messages';

	const messageMapping: {
		[type: string]: { icon: ComponentType; color: 'blue' | 'green' | 'red' };
	} = {
		success: {
			icon: CheckCircleSolid,
			color: 'green'
		},
		info: {
			icon: ExclamationCircleSolid,
			color: 'blue'
		},
		error: {
			icon: CloseCircleSolid,
			color: 'red'
		}
	};

	export let message: Message;
</script>

{#if message}
	{@const color = messageMapping[message.type].color}
	{@const icon = messageMapping[message.type].icon}
	<div {...$$restProps}>
		<Toast {color} on:close={() => dismissMessage(message.id)}>
			<svelte:fragment slot="icon">
				<svelte:component this={icon} class="h-5 w-5" />
			</svelte:fragment>
			{message.message}
		</Toast>
	</div>
{/if}
