<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSeed } from '$lib/runes.svelte';
	import { HD, Mnemonic } from '@bsv/sdk';
	import { onMount } from 'svelte';
	import { createSPVFunds, getSPV } from '$lib/spv-store';
	import { OneSatWebSPV, type BlockHeader } from 'spv-store';

	onMount(async () => {
		if (getSeed() === '') {
			goto('/wallet/decrypt');
		}

		const hdWallet = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
		const checkWallet: string = hdWallet.derive("m/44'/236'/0'/0/0").privKey.toAddress();
		await createSPVFunds(checkWallet);

		const spv: OneSatWebSPV = getSPV(checkWallet);

		const chainTip: BlockHeader | undefined = await spv.getChaintip();

		if (chainTip === undefined) {
			throw new Error('No chain tip found');
		}

		if (chainTip.height !== chainTip.synced) {
			goto('/wallet/sync');
		} else {
			console.log('Chain tip synced');
		}
	});
</script>
