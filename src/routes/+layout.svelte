<script lang="ts">
	import { getData } from '$lib/runes.svelte';
	import '../app.css';
	let { children } = $props();

	$effect(() => {
		const data = getData();
		if (data === undefined) {
			return;
		}

		localStorage.setItem('seed', data.seed);
		localStorage.setItem('xpub', data.xpub);
		localStorage.setItem('salt', data.salt);
		localStorage.setItem('iv', data.iv);
	});
</script>

<div class="bg-stone-100">
	<div class="flex h-screen flex-col items-center justify-center">
		{@render children()}
	</div>
</div>

<footer class="fixed bottom-0 left-0 w-full p-4 font-poppins text-sm text-black">
	<p>Copyright © 2024-2025 BitVault and contributors. MIT Licensed</p>
</footer>
