import { HD, Mnemonic } from "@bsv/sdk";
import type { WalletData } from "./types";
import type { OneSatWebSPV } from "spv-store";
import { createSPV, getSPV } from "./spv-store";

let needSyncCheck: boolean = true;

//@ts-expect-error
let data: WalletData | undefined = $state(loadData());
let seed: string = $state('');
let spvSynced: boolean = $state(false);

function loadData() {
    const d = localStorage.getItem('seed');
    if (d === null) {
        return undefined;
    }

    return {
        seed: localStorage.getItem('seed'),
        xpub: localStorage.getItem('xpub'),
        salt: localStorage.getItem('salt'),
        iv: localStorage.getItem('iv'),
    };
}

export function getData(): WalletData | undefined {
    return data;
}

export function setData(d: WalletData | undefined): void {
    data = d;
    //@ts-expect-error
    localStorage.setItem('seed', d.seed);
    //@ts-expect-error
	localStorage.setItem('xpub', d.xpub);
    //@ts-expect-error
	localStorage.setItem('salt', d.salt);
    //@ts-expect-error
	localStorage.setItem('iv', d.iv);
}

export function getSeed(): string {
    return seed;
}

export function setSeed(s: string): void {
    seed = s;
}

export async function getSpvSynced(): Promise<boolean> {
    if (needSyncCheck) {
        const hdWallet: HD = HD.fromSeed(new Mnemonic(getSeed()).toSeed());
        const address: string = hdWallet.derive("m/44'/236'/0'/0/0").privKey.toAddress();

        let spv: OneSatWebSPV;
        try {
            spv = getSPV(address);
        } catch {
            createSPV(address);
            spv = getSPV(address);
        }

        return (await spv.getSyncedBlock())?.height === 0;
    } else {
        return true;
    }
}

export function setSpvSynced(s: boolean): void {
    spvSynced = s;
}