<script lang="ts">
	import { goto } from '$app/navigation';
	import { heading1, heading3, primaryButton } from '$lib/classes';
	import { getData, setData, setSeed } from '$lib/runes.svelte';
	import type { WalletData } from '$lib/types';
	import crypto from 'crypto';
	import { tick } from 'svelte';

	let password: string = '';

	async function submit() {
		//@ts-expect-error
		setSeed(getData()?.seed);

		const salt: Buffer = crypto.randomBytes(16);
		const key: Buffer = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

		// Encrypt
		const iv: Buffer = crypto.randomBytes(16);
		const cipher: crypto.Cipheriv = crypto.createCipheriv('aes-256-cbc', key, iv);
		//@ts-expect-error
		let encrypted: string = cipher.update(getData()?.seed, 'utf8', 'hex') + cipher.final('hex');

		const newData: WalletData = {
			seed: encrypted,
			//@ts-expect-error
			xpub: getData()?.xpub,
			salt: salt.toString('hex'),
			iv: iv.toString('hex')
		};

		setData(newData);
		await tick();
		goto('/wallet/sync');
	}

	function preventDefault(fn: { (): Promise<void>; call?: any; }) {
		return function (event: { preventDefault: () => void; }) {
			event.preventDefault();
            //@ts-expect-error
			fn.call(this, event);
		};
	}
</script>

<h1 class={heading1}>Enter Your Password</h1>
<h3 class={heading3}>
	To protect your wallet from malware and more, we are going to encrypt your wallet. Please enter a
	password below:
</h3>
<form onsubmit={preventDefault(submit)} class="flex flex-col items-center justify-center">
	<input
		type="password"
		class="w-full rounded-lg border-2 border-gray-300 p-2"
		placeholder="Enter your password"
		id="password"
        autocomplete="off"
		bind:value={password}
	/>
	<br />
	<input type="submit" class={primaryButton} value="Submit" />
</form>
