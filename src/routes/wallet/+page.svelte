<script lang="ts">
	import { goto } from '$app/navigation';
	import { getBSVBalance, getNextAddress } from '$lib/addresses';
	import { getSpvSynced } from '$lib/runes.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!(await getSpvSynced())) {
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
	<p>BSV Balance: Syncronising...</p>
{:then balance}
	<p>BSV Balance: {balance}</p>
{/await}
