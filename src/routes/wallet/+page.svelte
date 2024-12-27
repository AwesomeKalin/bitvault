<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSeed } from '$lib/runes.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (getSeed() === '') {
			goto('/wallet/decrypt');
		}
	});
</script>
