<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import FloatingLabelInput from 'flowbite-svelte/FloatingLabelInput.svelte';
	import Heading from 'flowbite-svelte/Heading.svelte';
	import P from 'flowbite-svelte/P.svelte';
	import { get } from 'svelte/store';
	import Eye from '~/components/Eye.svelte';
	import * as stores from '~/core/stores';
	import { accessToken, clientID, clientSecret, refreshToken } from '~/core/stores';
	import raindrop from '~/lib/raindrop';

	let showClientID = false;
	let showClientSecret = false;
	let showAccessToken = false;
	let showRefreshToken = false;

	/**
	 * Launch web auth flow.
	 */
	async function launchWebAuthFlow() {
		const { accessToken, refreshToken } = await raindrop.auth.launchWebAuthFlow({
			clientID: get(stores.clientID),
			clientSecret: get(stores.clientSecret)
		});
		stores.accessToken.set(accessToken);
		stores.refreshToken.set(refreshToken);
	}
</script>

<div>
	<Heading data-testid="heading" class="mt-2" tag="h2" customSize="text-xl font-bold">
		General
	</Heading>
	<P data-testid="description" class="mt-2">Extension global settings.</P>
	<P>
		<!-- TODO: More detailed guide registering application with pictures -->
		To register your application, <b>Client ID</b> and <b>Client Secret</b> then click
		<b>Register</b>.
	</P>
	<div class="grid grid-cols-1">
		<div class="mt-6 grid grid-flow-row grid-cols-1 gap-x-4 gap-y-6">
			<div class="flex">
				<FloatingLabelInput
					data-testid="client-id/input"
					classDiv="w-full mr-2"
					id="client-id"
					type={showClientID ? 'text' : 'password'}
					required
					bind:value={$clientID}
				>
					Client ID
				</FloatingLabelInput>
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
					required
					bind:value={$clientSecret}
				>
					Client Secret
				</FloatingLabelInput>
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
					disabled
					bind:value={$accessToken}
				>
					Access Token
				</FloatingLabelInput>
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
					disabled
					bind:value={$refreshToken}
				>
					Refresh Token
				</FloatingLabelInput>
				<Eye
					data-testid="refresh-token/show-button"
					on:click={() => {
						showRefreshToken = !showRefreshToken;
					}}
					bind:open={showRefreshToken}
				/>
			</div>
		</div>
		<!-- TODO: Debug actions: check token validity, force refresh token, etc. -->
		<div class="mt-3 flex">
			<!-- TODO: Validate inputs (client ID and secret) -->
			<Button outline on:click={launchWebAuthFlow}>Register</Button>
		</div>
	</div>
</div>
