import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock, AddressBlock } from '../common/index';

type TradePageHeaderProps = {
  pairBalanceQSD: BigNumber,
  pairBalanceDAI: BigNumber,
  uniswapPair: string,
};

const TradePageHeader = ({
  pairBalanceQSD, pairBalanceDAI, uniswapPair,
}: TradePageHeaderProps) => {
  const price = pairBalanceDAI.dividedBy(pairBalanceQSD);

  return (
    <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="QSD Price" balance={price} suffix={"DAI"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="QSD Liquidity" balance={pairBalanceQSD} suffix={"QSD"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="DAI Liquidity" balance={pairBalanceDAI} suffix={"DAI"}/>
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
