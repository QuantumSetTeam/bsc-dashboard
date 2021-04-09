import {
    UniV2PairAddress,
    GovernanceToken,
    Dao,
    Dai,
    Dollar,
    PoolBonding,
    PoolLP,
    PoolGov,
    // newPoolLP,
    // newPoolBonding,
} from './contracts';

export const UNI = {
    addr: UniV2PairAddress,
    decimals: 18,
    symbol: 'UNI',
};

export const BUSD = {
    addr: Dai,
    decimals: 18,
    symbol: 'BUSD',
};

export const QSD = {
    addr: Dollar,
    decimals: 18,
    symbol: 'QSD',
};

export const QSDS = {
    addr: Dao,
    decimals: 18,
    symbol: 'QSDS',
};

export const QSG = {
    addr: GovernanceToken,
    decimals: 18,
    symbol: 'QSG',
};

export const PoolBondingAdd = {
    addr: PoolBonding,
    decimals: 18,
    symbol: 'PoolBonding',
};

export const PoolLPAdd = {
    addr: PoolLP,
    decimals: 18,
    symbol: 'PoolLP',
};

// export const newPoolBondingAdd = {
//     addr: newPoolBonding,
//     decimals: 18,
//     symbol: 'PoolBonding',
// };

// export const newPoolLPAdd = {
//     addr: newPoolLP,
//     decimals: 18,
//     symbol: 'PoolLP',
// };

export const PoolGovAdd = {
    addr: PoolGov,
    decimals: 18,
    symbol: 'PoolGov',
};
