<script lang="ts">
	import { goto } from '$app/navigation';
	import { heading1, heading3, primaryButton } from '$lib/classes';
	import { getData, setData, setSeed } from '$lib/runes.svelte';
	import type { WalletData } from '$lib/types';
	import crypto from 'crypto';

	function submit() {
        //@ts-expect-error
        setSeed(getData()?.seed);
		//@ts-expect-error
		const password: string = document.getElementById('password')?.value;

		const salt: Buffer = crypto.randomBytes(16);
		const key: Buffer = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

		// Encrypt
		const iv: Buffer = crypto.randomBytes(16);
		const cipher: crypto.Cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        //@ts-expect-error
		let encrypted: string = cipher.update(getData()?.seed, 'utf8', 'hex') + cipher.final('hex');

        const newData: WalletData = {
            seed: encrypted,
            //@ts-expect-error
            xpub: getData()?.xpub,
            salt: salt.toString('hex'),
            iv: iv.toString('hex'),
        };

        setData(newData);

        goto('/wallet/sync');
	}
</script>

<h1 class={heading1}>Enter Your Password</h1>
<h3 class={heading3}>
	To protect your wallet from malware and more, we are going to encrypt your wallet. Please enter a password
	below:
</h3>
<br />
<input type="password" id="password" />
<br />
<button class={primaryButton} onclick={submit}>Submit</button>
