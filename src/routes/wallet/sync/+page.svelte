<script lang="ts">
	import { heading1, heading3, paragraph } from '$lib/classes';
	import { HD, Mnemonic } from '@bsv/sdk';
	import type { OneSatWebSPV, BlockHeader } from 'spv-store';
	import { onMount } from 'svelte';
	import { getSeed } from '../../../lib/runes.svelte';
	import { createSPVFunds, getSPV } from '../../../lib/spv-store';
	import { goto } from '$app/navigation';

	let height: number = $state(0);
	let spv: OneSatWebSPV | undefined = $state(undefined);
	let finalHeight: number = $state(0);

	onMount(async () => {
		const hdWallet = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
		const checkWallet: string = hdWallet.derive("m/44'/236'/0'/0/0").privKey.toAddress();
		await createSPVFunds(checkWallet);

		spv = getSPV(checkWallet);

		const chainTip: BlockHeader | undefined = await spv.getChaintip();

		spv.sync();

		finalHeight = chainTip?.height ?? 0;

		spv.events.on('syncedBlockHeight', (blockno: number) => {
			height = blockno;
			if (height >= finalHeight) {
				finishSync();
			}
		});
	});

	function finishSync() {
		goto('/wallet');
	}
</script>

<h1 class={heading1}>Syncronising block headers</h1>
<h3 class={heading3}>
	As this is an SPV wallet, we need to syncronise all block headers in order to confirm
	transactions! Hang tight, this shouldn't take more than a few minutes.
</h3>

<p class={paragraph}>{height}/{finalHeight}</p>
