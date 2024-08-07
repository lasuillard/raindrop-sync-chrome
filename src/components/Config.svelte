<script lang="ts">
	import { Button, FloatingLabelInput, P } from 'flowbite-svelte';
	import { get } from 'svelte/store';
	import Eye from '~/components/Eye.svelte';
	import { putMessage } from '~/lib/messages';
	import { launchWebAuthFlow as _launchWebAuthFlow } from '~/lib/raindrop/auth';
	import { accessToken, clientID, clientSecret, refreshToken } from '~/lib/settings';

	let showClientID = false;
	let showClientSecret = false;
	let showAccessToken = false;
	let showRefreshToken = false;

	const launchWebAuthFlow = async () => {
		try {
			const result = await _launchWebAuthFlow({
				clientID: get(clientID),
				clientSecret: get(clientSecret)
			});
			accessToken.set(result.accessToken);
			refreshToken.set(result.refreshToken);
			putMessage({ type: 'success', message: 'Successfully authorized app.' });
		} catch (err) {
			console.error('Failed to authorize app:', err);
			putMessage({ type: 'error', message: String(err) });
		}
	};
</script>

<div>
	<P data-testid="description">Extension global settings.</P>
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
