import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock, AddressBlock } from '../common/index';

type TradePageHeaderProps = {
  pairBalanceQSD: BigNumber,
  pairBalanceBUSD: BigNumber,
  uniswapPair: string,
};

const TradePageHeader = ({
  pairBalanceQSD, pairBalanceBUSD, uniswapPair,
}: TradePageHeaderProps) => {
  const price = pairBalanceBUSD.dividedBy(pairBalanceQSD);

  return (
    <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="QSD Price" balance={price} suffix={"BUSD"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="QSD Liquidity" balance={pairBalanceQSD} suffix={"QSD"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="BUSD Liquidity" balance={pairBalanceBUSD} suffix={"BUSD"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <>
          <AddressBlock label="Uniswap Contract" address={uniswapPair} />
        </>
      </div>
    </div>
  );
}


export default TradePageHeader;
