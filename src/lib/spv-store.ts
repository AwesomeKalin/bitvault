import { Bsv20Indexer, Bsv21Indexer, CosignIndexer, FundIndexer, Indexer, IndexMode, InscriptionIndexer, LockIndexer, MapIndexer, OneSatIndexer, OneSatWebSPV, OrdLockIndexer, OriginIndexer, SigmaIndexer } from 'spv-store';

const spvProviders: Map<string, OneSatWebSPV> = new Map();

export async function createSPV(address: string): Promise<void> {
    if (spvProviders.has(address)) return;
    const owners: Set<string> = new Set<string>([address]);
    const indexers: Indexer[] = [
        new FundIndexer(owners, 'mainnet'),
        new LockIndexer(owners, 'mainnet'),
        new Bsv21Indexer(owners, IndexMode.Trust),
        new Bsv20Indexer(owners, IndexMode.Trust, 'mainnet'),
        new CosignIndexer(owners, 'mainnet'),
        new OneSatIndexer(owners, 'mainnet'),
        new OrdLockIndexer(owners, 'mainnet'),
        new InscriptionIndexer(owners, 'mainnet'),
        new MapIndexer(owners, 'mainnet'),
        new SigmaIndexer(owners, 'mainnet'),
        new OriginIndexer(owners, 'mainnet'),
        new LockIndexer(owners, 'mainnet'),
    ];

    spvProviders.set(address, await OneSatWebSPV.init(`${address}-bitvault`, indexers, owners, undefined, undefined, new Set<string>(['fund', 'lock', 'origin'])));
}

export function getSPV(address: string): OneSatWebSPV {
    const spv: OneSatWebSPV | undefined = spvProviders.get(address);

    if (spv === undefined) {
        throw new Error('SPV not found');
    }

    return spv;
}