import React, { useState, useEffect } from 'react';
import { LinkBase, Box, Layout } from '@aragon/ui';

import BigNumber from 'bignumber.js';
import { getTokenBalance } from '../../utils/infura';
import { toTokenUnitsBN } from '../../utils/number';

import TradePageHeader from './Header';
import {QSD, UNI, BUSD} from "../../constants/tokens";
import IconHeader from "../common/IconHeader";


function UniswapPool({ user }: {user: string}) {
  const [pairBalanceQSD, setPairBalanceQSD] = useState(new BigNumber(0));
  const [pairBalanceBUSD, setPairBalanceBUSD] = useState(new BigNumber(0));

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        pairBalanceQSDStr, pairBalanceBUSDStr,
      ] = await Promise.all([
        getTokenBalance(QSD.addr, UNI.addr),
        getTokenBalance(BUSD.addr, UNI.addr),
      ]);

      if (!isCancelled) {
        setPairBalanceQSD(toTokenUnitsBN(pairBalanceQSDStr, QSD.decimals));
        setPairBalanceBUSD(toTokenUnitsBN(pairBalanceBUSDStr, BUSD.decimals));
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <Layout>
      <IconHeader icon={<i className="fas fa-exchange-alt"/>} text="Trade"/>

      <TradePageHeader
        pairBalanceQSD={pairBalanceQSD}
        pairBalanceBUSD={pairBalanceBUSD}
        uniswapPair={UNI.addr}
      />

      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            title="Info"
            description="View QSD-BUSD pool stats."
            icon={<i className="fas fa-chart-area"/>}
            href={"https://uniswap.info/pair/0x88ff79eb2bc5850f27315415da8685282c7610f9"}
          />
        </div>

        <div style={{ flexBasis: '30%' }}>
          <MainButton
            title="Trade"
            description="Trade QSD tokens."
            icon={<i className="fas fa-exchange-alt"/>}
            href={"https://uniswap.exchange/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x36f3fd68e7325a35eb768f1aedaae9ea0689d723"}
          />
        </div>

        <div style={{ flexBasis: '30%', marginLeft: '3%', marginRight: '2%' }}>
          <MainButton
            title="Supply"
            description="Supply and redeem liquidity."
            icon={<i className="fas fa-water"/>}
            href={"https://uniswap.exchange/add/0x36f3fd68e7325a35eb768f1aedaae9ea0689d723/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"}
          />
        </div>
      </div>
    </Layout>
  );
}

type MainButtonProps = {
  title: string,
  description: string,
  icon: any,
  href:string
}

function MainButton({
  title, description, icon, href,
}:MainButtonProps) {
  return (
    <LinkBase href={href} style={{ width: '100%' }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
        </div>
        <span style={{ fontSize: 48 }}>
          {icon}
        </span>
        {/*<img alt="icon" style={{ padding: 10, height: 64 }} src={iconUrl} />*/}
        <div style={{ paddingTop: 5, opacity: 0.5 }}>
          {' '}
          {description}
          {' '}
        </div>

      </Box>
    </LinkBase>
  );
}

export default UniswapPool;
