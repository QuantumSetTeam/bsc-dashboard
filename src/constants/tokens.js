import { UniV2PairAddress, GovernanceToken, Dao, Dollar } from './contracts';

export const UNI = {
  addr: UniV2PairAddress,
  decimals: 18,
  symbol: 'UNI',
};

export const DAI = {
  addr: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
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
