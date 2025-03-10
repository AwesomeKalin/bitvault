import { HD, Mnemonic } from "@bsv/sdk";
import { getSeed } from "./runes.svelte";
import { createSPV, getSPV } from "./spv-store";
import { TxoLookup } from "spv-store";

export async function getNextAddress() {
    const hdWallet: HD = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
    const basePath: string = "m/44'/236'/0'/0";
    
    let nextCheck: number = 0;

    while (true) {
        const address: string = hdWallet.derive(`${basePath}/${nextCheck}`).privKey.toAddress();
        createSPV(address);
        const spv = getSPV(address);

        if ((await spv.getRecentTxs()).length === 0) return address;
        nextCheck++;
    }
}

export async function getBSVBalance() {
    const hdWallet: HD = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
    const basePath: string = "m/44'/236'/0'/0";
    
    let nextCheck: number = 0;
    let balance: number = 0;

    while (true) {
        //const address: string = hdWallet.derive(`${basePath}/${nextCheck}`).privKey.toAddress();
        const address: string = '142dcg1Un4u6na2sR9gTgaB5QybqE4sZbT';
        createSPV(address);
        const spv = getSPV(address);
        console.log('1');

        console.log(await spv.getRecentTxs());
        if ((await spv.getRecentTxs()).length === 0) return balance;
        console.log('2');

        const txos = (await spv.search(new TxoLookup('fund'), undefined, 0)).txos;
        console.log('3');

        for (let i = 0; i < txos.length; i++) {
            balance += parseInt(txos[i].satoshis.toString());
        }

        nextCheck++;

        return balance;
    }
}