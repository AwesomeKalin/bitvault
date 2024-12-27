<script lang="ts">
	import { goto } from '$app/navigation';
	import { heading1, heading3, paragraph, primaryButton, secondaryButton } from '$lib/classes';
	import { getData } from '$lib/runes.svelte';
	import type { WalletData } from '$lib/types';

	let wrongSeed: boolean = $state(false);
	let error: boolean = $state(false);

	function confirmSeed() {
		wrongSeed = false;
		error = false;
		const data: WalletData | undefined = getData();
		if (data === undefined) {
			error = true;
			return;
		}

        //@ts-expect-error
		if (data.seed === document.getElementById('confirmseed')?.value) {
			goto('/create/encrypt');
		}

		wrongSeed = true;
	}
</script>

<h1 class={heading1}>Verify your Mnemonic</h1>
<h3 class={heading3}>
	Let's confirm you have saved the mnemonic! Please write your mnemonic below.
</h3>
<br />
<textarea id="confirmseed" class="text-sm resize-none"></textarea>
<br />
{#if error}
	<p class="{paragraph} text-red-600">Unknown error</p>
    <br />
{/if}

{#if wrongSeed}
	<p class="{paragraph} text-red-600">Incorrect Seed</p>
    <br />
{/if}

<div class="space-x-8">
	<button class={primaryButton} onclick={confirmSeed}>Confirm Mnemonic</button>
	<a href="/create/new" class={secondaryButton}>I didn't save it, give me a new one!</a>
</div>
