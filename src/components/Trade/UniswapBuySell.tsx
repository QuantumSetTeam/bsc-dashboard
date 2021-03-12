import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {buyQSD, sellQSD} from '../../utils/web3';

import { getCost, getProceeds } from '../../utils/infura';


import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {QSD, BUSD} from "../../constants/tokens";
import {decreaseWithSlippage, increaseWithSlippage} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type UniswapBuySellProps = {
  userBalanceQSD: BigNumber,
  pairBalanceQSD: BigNumber
};

function UniswapBuySell({
  userBalanceQSD, pairBalanceQSD
}: UniswapBuySellProps) {
  const [buyAmount, setBuyAmount] = useState(new BigNumber(0));
  const [sellAmount, setSellAmount] = useState(new BigNumber(0));
  const [cost, setCost] = useState(new BigNumber(0));
  const [proceeds, setProceeds] = useState(new BigNumber(0));

  const updateCost = async (buyAmount) => {
    const buyAmountBN = new BigNumber(buyAmount);
    if (buyAmountBN.lte(new BigNumber(0))) {
      setCost(new BigNumber(0));
      return;
    }
    if (buyAmountBN.gte(pairBalanceQSD)) {
      setCost(new BigNumber(0));
      return;
    }
    const cost = await getCost(toBaseUnitBN(buyAmountBN, QSD.decimals));
    setCost(toTokenUnitsBN(new BigNumber(cost), BUSD.decimals));
  };

  const updateProceeds = async (sellAmount) => {
    const sellAmountBN = new BigNumber(sellAmount);
    if (sellAmountBN.lte(new BigNumber(0))) {
      setProceeds(new BigNumber(0));
      return;
    }
    const proceeds = await getProceeds(toBaseUnitBN(sellAmountBN, QSD.decimals));
    setProceeds(toTokenUnitsBN(new BigNumber(proceeds), BUSD.decimals));
  };

  return (
    <Box heading="Exchange">
      <div style={{ display: 'flex' }}>
        {/* total Issued */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="Døllar Balance" balance={userBalanceQSD} suffix={" QSD"}/>
        </div>
        {/* Buy Token from Uniswap */}
        <div style={{ width: '32%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%' }}>
              <>
                <BigNumberInput
                  adornment="QSD"
                  value={buyAmount}
                  setter={(value) => {
                    setBuyAmount(value);
                    isPos(value) ? updateCost(value) : updateCost('0');
                  }}
                />
              </>
            </div>
            <div style={{ width: '40%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Buy"
                onClick={() => {
                  buyQSD(
                    toBaseUnitBN(buyAmount, QSD.decimals),
                    increaseWithSlippage(toBaseUnitBN(cost, BUSD.decimals)),
                  );
                }}
              />
            </div>
          </div>
          <PriceSection label="Cost: " amt={cost} symbol=" BUSD" />
        </div>
        <div style={{ width: '6%' }} />
        {/* Sell Token on Uniswap */}
        <div style={{ width: '32%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%' }}>
              <>
                <BigNumberInput
                  adornment="QSD"
                  value={sellAmount}
                  setter={(value) => {
                    setSellAmount(value);
                    isPos(value) ? updateProceeds(value) : updateProceeds('0');
                  }}
                />
                <MaxButton
                  onClick={() => {
                    setSellAmount(userBalanceQSD);
                    updateProceeds(userBalanceQSD);
                  }}
                />
                <PriceSection label="Proceeds: " amt={proceeds} symbol=" BUSD"/>
              </>
            </div>
            <div style={{ width: '40%' }}>
              <Button
                wide
                icon={<IconCircleMinus />}
                label="Sell"
                onClick={() => {
                  sellQSD(
                    toBaseUnitBN(sellAmount, QSD.decimals),
                    decreaseWithSlippage(toBaseUnitBN(proceeds, BUSD.decimals)),
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default UniswapBuySell;