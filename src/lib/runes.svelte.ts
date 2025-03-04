import type { WalletData } from "./types";

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
}

export function getSeed(): string {
    return seed;
}

export function setSeed(s: string): void {
    seed = s;
}

export function getSpvSynced(): boolean {
    return spvSynced;
}

export function setSpvSynced(s: boolean): void {
    spvSynced = s;
}