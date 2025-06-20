<script lang="ts">
	import { goto } from '$app/navigation';
	import { heading1, heading3, primaryButton } from '$lib/classes';
	import { setData } from '$lib/runes.svelte';
	import type { WalletData } from '$lib/types';
	import { HD, Mnemonic } from '@bsv/sdk';
	import { tick } from 'svelte';

    let mnemonicVal: string = '';

    async function submit() {
        const mnemonic: string = mnemonicVal.trim();
        
        let newData: WalletData = {
            seed: mnemonic,
            xpub: HD.fromSeed(new Mnemonic(mnemonic).toSeed()).toPublic().toString(),
            salt: '',
            iv: '',
        };

        setData(newData);
        await tick();
        goto('/create/encrypt');
    }

    function preventDefault(fn: { (): Promise<void>; call?: any; }) {
		return function (event: { preventDefault: () => void; }) {
			event.preventDefault();
            //@ts-expect-error
			fn.call(this, event);
		};
	}
</script>

<h1 class={heading1}>Import Wallet</h1>
<h3 class={heading3}>Please enter your 12-word mnemonic phrase below.</h3>
<br />
<form onsubmit={preventDefault(submit)} class="flex flex-col items-center justify-center">
	<input
		type="text"
		class="w-full rounded-lg border-2 border-gray-300 p-2"
		placeholder="Enter your 12-word mnemonic phrase"
        id="mnemonic"
        autocomplete="off"
        bind:value={mnemonicVal}
	/>
	<br />
	<input type="submit" class={primaryButton} value="Import" />
</form>
