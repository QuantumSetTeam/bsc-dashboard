import { UniV2PairAddress, GovernanceToken, Dao, Dai, Dollar, PoolBonding } from './contracts';

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