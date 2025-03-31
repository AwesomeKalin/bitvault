import { HD, Mnemonic } from "@bsv/sdk";
import { getSeed } from "./runes.svelte";
import { createSPV, getSPV } from "./spv-store";
import { OneSatWebSPV, TxoLookup } from "spv-store";

export async function getNextAddress() {
    const hdWallet: HD = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
    const basePath: string = "m/44'/236'/0'/0";
    
    let nextCheck: number = 0;

    while (true) {
        const address: string = hdWallet.derive(`${basePath}/${nextCheck}`).privKey.toAddress();
        createSPV(address);
        const spv = getSPV(address);

        await spv.sync();

        // Check for any type of transaction
        if (await checkIfAddressUsed(spv)) {
            nextCheck++;
            continue;
        }

        return address;
    }
}

export async function getBSVBalance() {
    const hdWallet: HD = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
    const basePath: string = "m/44'/236'/0'/0";
    
    let nextCheck: number = 0;
    let balance: number = 0;

    while (true) {
        const address: string = hdWallet.derive(`${basePath}/${nextCheck}`).privKey.toAddress();
        createSPV(address);
        const spv = getSPV(address);

        await spv.sync();

        if (!(await checkIfAddressUsed(spv))) return balance;

        const txos = (await spv.search(new TxoLookup('fund'), undefined, 0)).txos;

        for (let i = 0; i < txos.length; i++) {
            balance += parseInt(txos[i].satoshis.toString());
        }

        nextCheck++;
    }
}

async function tagCheck(spv: OneSatWebSPV, tag: string): Promise<boolean> {
    return (await spv.search(new TxoLookup(tag, undefined, undefined, undefined, true), undefined, 0)).txos.length > 0;
}

async function checkIfAddressUsed(spv: OneSatWebSPV): Promise<boolean> {
    if (await tagCheck(spv, '1sat')) return true;
    if (await tagCheck(spv, 'bsv20')) return true;
    if (await tagCheck(spv, 'bsv21')) return true;
    if (await tagCheck(spv, 'cosign')) return true;
    if (await tagCheck(spv, 'fund')) return true;
    if (await tagCheck(spv, 'insc')) return true;
    if (await tagCheck(spv, 'lock')) return true;
    if (await tagCheck(spv, 'map')) return true;
    if (await tagCheck(spv, 'opns')) return true;
    if (await tagCheck(spv, 'list')) return true;
    if (await tagCheck(spv, 'origin')) return true;
    if (await tagCheck(spv, 'sigma')) return true;

    return false;
}