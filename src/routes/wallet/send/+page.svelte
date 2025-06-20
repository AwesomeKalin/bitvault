<script lang="ts">
	import { goto } from '$app/navigation';
	import { getNextAddress, getTxos, isValidAddress } from '$lib/addresses';
	import { heading1, heading3, primaryButton, redParagraph, secondaryButton } from '$lib/classes';
	import { P2PKH, PrivateKey, SatoshisPerKilobyte, Transaction } from '@bsv/sdk';
	import type { OneSatWebSPV, Txo } from 'spv-store';
	import { tick } from 'svelte';

	let error: string = '';

	async function sendTransaction() {
		const address = (document.getElementById('address') as HTMLInputElement).value;
		const amount = (document.getElementById('amount') as HTMLInputElement).value;
		error = ''; // Reset error message

		// Validate the inputs
		if (!address || !amount) {
			error = 'Please fill in all fields.';
			return;
		}

		if (isNaN(Number(amount)) || Number(amount) <= 0) {
			error = 'Please enter a valid amount.';
			return;
		}

		if (!isValidAddress(address)) {
			error = 'Invalid BSV address.';
			return;
		}

		// Create transaction
		const tx = new Transaction();

		tx.addOutput({
			lockingScript: new P2PKH().lock(address),
			satoshis: Number(amount) * Math.pow(10, 8)
		});

		tx.addOutput({
			lockingScript: new P2PKH().lock(await getNextAddress()),
			change: true
		});

		// Get txos
		const txos:
			| false
			| {
					txo: Txo;
					privKey: PrivateKey;
					spv: OneSatWebSPV;
			  }[] = await getTxos(Number(amount) * Math.pow(10, 8), tx.toBinary().length);

		if (txos === false) {
			error = 'Not enough balance.';
			return;
		}

		try {
			for (var i = 0; i < txos.length; i++) {
				const txo = txos[i].txo;
				tx.addInput({
					sourceTransaction: await txos[i].spv.getTx(txo.outpoint.txid),
					sourceOutputIndex: txo.outpoint.vout,
					unlockingScriptTemplate: new P2PKH().unlock(txos[i].privKey)
				});
			}
		} catch {
			error = 'Error creating transaction.';
			return;
		}

		await tx.fee(new SatoshisPerKilobyte(1));
		await tx.sign();
		
        await txos[0].spv.broadcast(tx);

        for (var i = 1; i < txos.length; i++) {
            await txos[i].spv.parseTx(tx);
        }

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

<h1 class={heading1}>Send</h1>
<h3 class={heading3}>Send BSV to an address</h3>

<br />
<form>
	<input type="text" placeholder="BSV Address" id="address" autocomplete="off" />
	<br />
	<input type="text" placeholder="Amount (in BSV)" id="amount" autocomplete="off" />
	<br />
	<p class={redParagraph}>{error}</p>
	<br />
	<input type="submit" value="Send" onclick={preventDefault(sendTransaction)} class={primaryButton} />
</form>

<br />
<a href="/wallet" class={secondaryButton}>Return</a>
