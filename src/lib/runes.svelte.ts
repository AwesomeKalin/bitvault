import type { WalletData } from "./types";

let data: WalletData | undefined = $state(loadData());

function loadData() {
    const d = localStorage.getItem('data');
    if (d === null) {
        return undefined;
    }

    return JSON.parse(d);
}

export function getData(): WalletData | undefined {
    return data;
}

export function setData(d: WalletData | undefined): void {
    data = d;
}

let saveData = $derived(() => {
    if (data !== undefined) {
        localStorage.setItem('data', JSON.stringify(data));
    }
});