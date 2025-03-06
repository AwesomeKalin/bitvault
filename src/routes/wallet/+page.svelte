<script lang="ts">
	import { goto } from '$app/navigation';
	import { getBSVBalance, getNextAddress } from '$lib/addresses';
	import { getSpvSynced } from '$lib/runes.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!getSpvSynced()) {
			goto('/wallet/sync');
		} else {
			console.log('Chain tip synced');
		}
	});
</script>

{#await getNextAddress()}
	<p>Next address: Loading...</p>
{:then address}
	<p>Next address: {address}</p>
{/await}

{#await getBSVBalance()}
	<p>BSV Balance: Loading...</p>
{:then balance}
	<p>BSV Balance: {balance}</p>
{/await}
