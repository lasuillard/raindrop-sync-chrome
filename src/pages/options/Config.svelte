<script lang="ts">
	import FloatingLabelInput from 'flowbite-svelte/FloatingLabelInput.svelte';
	import Heading from 'flowbite-svelte/Heading.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import Eye from '~/components/Eye.svelte';
	import { accessToken, clientID, clientSecret, refreshToken } from '~/core/stores';

	let showClientID = false;
	let showClientSecret = false;
	let showAccessToken = false;
	let showRefreshToken = false;
</script>

<div>
	<Heading data-testid="heading" class="mt-2" tag="h2" customSize="text-xl font-bold"
		>General</Heading
	>
	<P data-testid="description" class="mt-2">Extension global settings.</P>
	<div class="grid grid-cols-1">
		<div class="mt-6 grid grid-flow-row grid-cols-1 gap-x-4 gap-y-6">
			<div class="flex">
				<FloatingLabelInput
					data-testid="client-id/input"
					classDiv="w-full mr-2"
					id="client-id"
					type={showClientID ? 'text' : 'password'}
					label="Client ID"
					required
					bind:value={$clientID}
				/>
				<Eye
					data-testid="client-id/show-button"
					on:click={() => {
						showClientID = !showClientID;
					}}
					bind:open={showClientID}
				/>
			</div>
			<div class="flex">
				<FloatingLabelInput
					data-testid="client-secret/input"
					classDiv="w-full mr-2"
					id="client-secret"
					type={showClientSecret ? 'text' : 'password'}
					label="Client Secret"
					required
					bind:value={$clientSecret}
				/>
				<Eye
					data-testid="client-secret/show-button"
					on:click={() => {
						showClientSecret = !showClientSecret;
					}}
					bind:open={showClientSecret}
				/>
			</div>
			<div class="flex">
				<FloatingLabelInput
					data-testid="access-token/input"
					classDiv="w-full mr-2"
					id="access-token"
					type={showAccessToken ? 'text' : 'password'}
					label="Access Token"
					disabled
					bind:value={$accessToken}
				/>
				<Eye
					data-testid="access-token/show-button"
					on:click={() => {
						showAccessToken = !showAccessToken;
					}}
					bind:open={showAccessToken}
				/>
			</div>
			<div class="flex">
				<FloatingLabelInput
					data-testid="refresh-token/input"
					classDiv="w-full mr-2"
					id="refresh-token"
					type={showRefreshToken ? 'text' : 'password'}
					label="Refresh Token"
					disabled
					bind:value={$refreshToken}
				/>
				<Eye
					data-testid="refresh-token/show-button"
					on:click={() => {
						showRefreshToken = !showRefreshToken;
					}}
					bind:open={showRefreshToken}
				/>
			</div>
			<!-- TODO: Most feature of popup should be here, e.g.) initiating OAuth, token validity check, force refresh token, etc. -->
		</div>
	</div>
</div>
