import { UniV2PairAddress, GovernanceToken, Dao, Dai, Dollar } from './contracts';

export const UNI = {
  addr: UniV2PairAddress,
  decimals: 18,
  symbol: 'UNI',
};

export const DAI = {
  addr: Dai,
  decimals: 18,
  symbol: 'DAI',
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