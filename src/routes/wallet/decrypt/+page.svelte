<script lang="ts">
	import { goto } from '$app/navigation';
	import { heading1, primaryButton } from '$lib/classes';
	import { getData, setSeed } from '$lib/runes.svelte';
	import type { WalletData } from '$lib/types';
	import crypto from 'crypto';
	import { tick } from 'svelte';

	async function submit() {
		//@ts-expect-error
		const password: string = document.getElementById('password')?.value;
		//@ts-expect-error Data checked if undefined before redirecting to this page
		const walletData: WalletData = getData();

		const key: Buffer = crypto.pbkdf2Sync(
			password,
			Buffer.from(walletData.salt, 'hex'),
			100000,
			32,
			'sha256'
		);

		const decipher: crypto.Decipheriv = crypto.createDecipheriv(
			'aes-256-cbc',
			key,
			Buffer.from(walletData.iv, 'hex')
		);
		let decrypted: string =
			decipher.update(walletData.seed, 'hex', 'utf8') + decipher.final('utf8');

		setSeed(decrypted);
		await tick();
		goto('/wallet');
	}

	function preventDefault(fn: { (): Promise<void>; call?: any; }) {
		return function (event: { preventDefault: () => void; }) {
			event.preventDefault();
            //@ts-expect-error
			fn.call(this, event);
		};
	}
</script>

<h1 class={heading1}>Enter Your Password to Decrypt Your Wallet</h1>
<br />
<form onsubmit={preventDefault(submit)} class="flex flex-col items-center justify-center">
	<input type="password" id="password" autocomplete="off" />
	<br />
	<input type="submit" class={primaryButton} value="Submit" />
</form>
