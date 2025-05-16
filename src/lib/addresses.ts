import { HD, Mnemonic, PrivateKey, Utils } from "@bsv/sdk";
import { getSeed } from "./runes.svelte";
import { createSPV, getSPV } from "./spv-store";
import { OneSatWebSPV, Txo, TxoLookup } from "spv-store";

export async function getNextAddress() {
    const hdWallet: HD = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
    const basePath: string = "m/44'/236'/0'/0";
    
    let nextCheck: number = 0;

    while (true) {
        const address: string = hdWallet.derive(`${basePath}/${nextCheck}`).privKey.toAddress();
        await createSPV(address);
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
        await createSPV(address);
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

export async function getUSDBalance() {
    const bsvBalance: number = await getBSVBalance() / Math.pow(10, 8);
    const bsvPrice: number = +(await getBSVPrice()).toFixed(2);

    return (bsvBalance * bsvPrice).toFixed(2);
}

export function isValidAddress(address: string): boolean {
    if (address[0] !== '1') return false;

    try {
        if (Utils.fromBase58Check(address, 'hex').data.length === 40) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

export async function getTxos(valueInSats: number, origSize: number): Promise<false | {
        txo: Txo;
        privKey: PrivateKey;
        spv: OneSatWebSPV;
    }[]> {
    const hdWallet: HD = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
    const basePath: string = "m/44'/236'/0'/0";

    let nextCheck: number = 0;
    let balance: number = 0;
    let size: number = origSize;
    let newValueInSats: number = valueInSats + Math.ceil(size / 1000);

    const txos: {
        txo: Txo;
        privKey: PrivateKey;
        spv: OneSatWebSPV;
    }[] = [];

    while (true) {
        const privKey: PrivateKey = hdWallet.derive(`${basePath}/${nextCheck}`).privKey;
        const address: string = privKey.toAddress();
        await createSPV(address);
        const spv = getSPV(address);

        await spv.sync();
        if (!(await checkIfAddressUsed(spv))) {
            return false;
        }

        const txosForWallet: Txo[] = (await spv.search(new TxoLookup('fund'), undefined, 0)).txos;

        for (let i = 0; i < txosForWallet.length; i++) {
            balance += parseInt(txosForWallet[i].satoshis.toString());
            txos.push({txo: txosForWallet[i], privKey, spv});

            size += 108;
            newValueInSats = valueInSats + Math.ceil(size / 1000);

            if (balance >= newValueInSats) {
                return txos;
            }
        }

        nextCheck++;
    }
}

async function getBSVPrice(): Promise<number> {
    return (await (await fetch('https://api.whatsonchain.com/v1/bsv/main/exchangerate')).json()).rate;
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