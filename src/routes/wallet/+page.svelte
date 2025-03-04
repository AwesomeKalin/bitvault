<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSeed, getSpvSynced } from '$lib/runes.svelte';
	import { HD, Mnemonic } from '@bsv/sdk';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!getSpvSynced()) {
			goto('/wallet/sync');
		} else {
			console.log('Chain tip synced');
		}
	});
</script>

<p>m/44'/236'/0'/0/0 wallet address: {HD.fromSeed(new Mnemonic(getSeed()).toSeed()).derive("m/44'/236'/0'/0/0").privKey.toAddress()}</p>