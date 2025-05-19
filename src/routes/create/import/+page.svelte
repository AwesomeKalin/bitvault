<script lang="ts">
	import { goto } from '$app/navigation';
	import { heading1, heading3, primaryButton } from '$lib/classes';
	import { setData } from '$lib/runes.svelte';
	import type { WalletData } from '$lib/types';
	import { HD, Mnemonic } from '@bsv/sdk';

    function submit() {
        //@ts-expect-error
        const mnemonic: string = document.getElementById('mnemonic')?.value;
        
        let newData: WalletData = {
            seed: mnemonic,
            xpub: HD.fromSeed(new Mnemonic(mnemonic).toSeed()).toPublic().toString(),
            salt: '',
            iv: '',
        };

        setData(newData);
        goto('/create/encrypt');
    }
</script>

<h1 class={heading1}>Import Wallet</h1>
<h3 class={heading3}>Please enter your 12-word mnemonic phrase below.</h3>
<br />
<form onsubmit={submit} class="flex flex-col items-center justify-center">
	<input
		type="text"
		class="w-full rounded-lg border-2 border-gray-300 p-2"
		placeholder="Enter your 12-word mnemonic phrase"
        id="mnemonic"
        autocomplete="off"
	/>
	<br />
	<input type="submit" class={primaryButton} value="Import" onclick={submit} />
</form>
