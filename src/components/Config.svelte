<script lang="ts">
	import { Button, P } from 'flowbite-svelte';
	import { get } from 'svelte/store';
	import SecretInput from '~/components/SecretInput.svelte';
	import { putMessage } from '~/lib/messages';
	import { launchWebAuthFlow as _launchWebAuthFlow } from '~/lib/raindrop/auth';
	import { accessToken, clientID, clientSecret, refreshToken } from '~/lib/settings';

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
			<SecretInput boundStore={clientID}>Client ID</SecretInput>
			<SecretInput boundStore={clientSecret}>Client Secret</SecretInput>
			<SecretInput boundStore={accessToken}>Access Token</SecretInput>
			<SecretInput boundStore={refreshToken}>Refresh Token</SecretInput>
			<!-- TODO: Flag to en/disable background sync, sync interval in minutes, toggle to run sync on startup -->
		</div>
		<!-- TODO: Debug actions: check token validity, force refresh token, etc. -->
		<div class="mt-3 flex">
			<!-- TODO: Validate inputs (client ID and secret) -->
			<Button outline on:click={launchWebAuthFlow}>Register</Button>
		</div>
	</div>
</div>
