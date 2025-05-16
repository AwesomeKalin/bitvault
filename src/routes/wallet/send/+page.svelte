<script lang="ts">
	import { goto } from "$app/navigation";
	import { getNextAddress, getTxos, isValidAddress } from "$lib/addresses";
	import { heading1, heading3, primaryButton, redParagraph, secondaryButton } from "$lib/classes";
	import { P2PKH, PrivateKey, SatoshisPerKilobyte, Transaction } from "@bsv/sdk";
	import type { Txo } from "spv-store";

    let error: string = "";

    async function sendTransaction() {
        const address = (document.getElementById("address") as HTMLInputElement).value;
        const amount = (document.getElementById("amount") as HTMLInputElement).value;
        error = ""; // Reset error message

        // Validate the inputs
        if (!address || !amount) {
            error = "Please fill in all fields.";
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            error = "Please enter a valid amount.";
            return;
        }

        if (!isValidAddress(address)) {
            error = "Invalid BSV address.";
            return;
        }

        // Get txos
        const txos: false | {
            txo: Txo;
            privKey: PrivateKey;
        }[] = await getTxos(Number(amount) * Math.pow(10, 8));

        if (txos === false) {
            error = "Not enough balance.";
            return;
        }

        // Create transaction
        const tx = new Transaction();

        for (var i = 0; i < txos.length; i++) {
            const txo = txos[i].txo;
            tx.addInput({
                sourceTXID: txo.outpoint.txid,
                sourceOutputIndex: txo.outpoint.vout,
                unlockingScriptTemplate: new P2PKH().unlock(txos[i].privKey),
            });
        }

        tx.addOutput({
            lockingScript: new P2PKH().lock(address),
            satoshis: Number(amount) * Math.pow(10, 8),
        });

        tx.addOutput({
            lockingScript: new P2PKH().lock(await getNextAddress()),
            change: true,
        });

        tx.fee(new SatoshisPerKilobyte(1));
        tx.sign();
        await tx.broadcast();

        goto("/wallet");
    }
</script>

<h1 class={heading1}>Send</h1>
<h3 class={heading3}>Send BSV to an address</h3>

<br />
<form>
	<input type="text" placeholder="BSV Address" id="address" />
    <br />
	<input type="text" placeholder="Amount (in BSV)" id="amount" />
	<br />
	<p class={redParagraph}>{error}</p>
	<br />
	<input type="submit" value="Send" onclick={sendTransaction} class="{primaryButton}" />
</form>

<br />
<a href="/wallet" class={secondaryButton}>Return</a>
