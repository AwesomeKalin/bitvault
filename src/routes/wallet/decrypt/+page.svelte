<script lang="ts">
	import { heading1, primaryButton } from "$lib/classes";
	import { getData, setSeed } from "$lib/runes.svelte";
	import type { WalletData } from "$lib/types";
    import crypto from 'crypto';

    function submit() {
        //@ts-expect-error
        const password: string = document.getElementById('password')?.value;
        //@ts-expect-error Data checked if undefined before redirecting to this page
        const walletData: WalletData = getData();

        const key: Buffer = crypto.pbkdf2Sync(password, walletData.salt, 100000, 32, 'sha256');

        const decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', key, walletData.iv);
        decipher.update(Buffer.from(walletData.seed, 'hex'));

        setSeed(decipher.final('utf8'));
    }
</script>

<h1 class={heading1}>Enter Your Password to Decrypt Your Wallet</h1>
<br />
<input type="password" id="password" />
<br />
<button class={primaryButton} onclick={submit}>Submit</button>
