<script lang="ts">
	import { goto } from '$app/navigation';
    import { heading1, heading3, paragraph, primaryButton, secondaryButton } from '$lib/classes';
	import { setData } from '$lib/runes.svelte';
	import type { WalletData } from '$lib/types';
    import { HD, Mnemonic } from '@bsv/sdk';
    import { writeText } from '@tauri-apps/plugin-clipboard-manager';

    let mnemonic: string = $state(Mnemonic.fromRandom().toString());

    function copyMnemonic() {
        writeText(mnemonic);
    }

    function nextPage() {
        let newData: WalletData = {
            seed: mnemonic,
            xpub: HD.fromSeed(new Mnemonic(mnemonic).toSeed()).toPublic().toString(),
            salt: '',
            iv: '',
        };

        setData(newData);
        goto('/create/verify');
    }
</script>

<h1 class={heading1}>New Wallet</h1>
<h3 class={heading3}>
	Please save the mnemonic below! You will be required to confirm that you have saved it on the next
	page
</h3>
<br />
<p class={paragraph}>{mnemonic}</p>
<br />
<div class="space-x-8">
    <button class={primaryButton} onclick={copyMnemonic}>Copy Mnemonic</button>
    <button class={secondaryButton} onclick={nextPage}>Next Page</button>
</div>