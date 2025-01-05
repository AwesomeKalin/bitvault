import { Bsv20Indexer, Bsv21Indexer, FundIndexer, Indexer, IndexMode, InscriptionIndexer, LockIndexer, MapIndexer, OneSatIndexer, OneSatWebSPV, OrdLockIndexer, OriginIndexer, SigmaIndexer } from 'spv-store';

const spvProviders: Map<string, OneSatWebSPV> = new Map();

export async function createSPVFunds(address: string): Promise<void> {
    if (!spvProviders.has(address)) {
        const owners: Set<string> = new Set<string>([address]);
        const indexers: Indexer[] = [
            new FundIndexer(owners, IndexMode.TrustAndVerify, 'mainnet'),
            new LockIndexer(owners, IndexMode.TrustAndVerify, 'mainnet'),
        ];

        spvProviders.set(address, await OneSatWebSPV.init('', indexers, owners));
    }
}

export async function createSPVOrd(address: string): Promise<void> {
    if (!spvProviders.has(address)) {
        const owners: Set<string> = new Set<string>([address]);
        const indexers: Indexer[] = [
            new Bsv21Indexer(owners, IndexMode.Trust, 'mainnet'),
            new Bsv20Indexer(owners, IndexMode.Trust, 'mainnet'),
            new OneSatIndexer(owners, IndexMode.TrustAndVerify, 'mainnet'),
            new OrdLockIndexer(owners, IndexMode.TrustAndVerify, 'mainnet'),
            new InscriptionIndexer(owners, IndexMode.TrustAndVerify, 'mainnet'),
            new MapIndexer(owners, IndexMode.Verify, 'mainnet'),
            new SigmaIndexer(owners, IndexMode.Verify, 'mainnet'),
            new OriginIndexer(owners, IndexMode.TrustAndVerify, 'mainnet'),
        ];

        spvProviders.set(address, await OneSatWebSPV.init('', indexers, owners));
    }
}

export function getSPV(address: string): OneSatWebSPV {
    const spv: OneSatWebSPV | undefined = spvProviders.get(address);

    if (spv === undefined) {
        throw new Error('SPV not found');
    }

    return spv;
}