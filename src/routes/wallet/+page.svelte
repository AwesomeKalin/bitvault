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

<p>Next address: {await getNextAddress()}</p>
<p>BSV Balance: {await getBSVBalance()}</p>