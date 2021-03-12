import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Button, IconCirclePlus } from '@aragon/ui';
import { addLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {QSD, UNI, BUSD} from "../../constants/tokens";
import {SLIPPAGE} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type AddliquidityProps = {
  userBalanceQSD: BigNumber,
  userBalanceBUSD: BigNumber,
  pairBalanceQSD: BigNumber,
  pairBalanceBUSD: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}

function AddLiquidity({
  userBalanceQSD,
  userBalanceBUSD,
  pairBalanceQSD,
  pairBalanceBUSD,
  pairTotalSupplyUNI,
}: AddliquidityProps) {
  const [amountBUSD, setAmountBUSD] = useState(new BigNumber(0));
  const [amountQSD, setAmountQSD] = useState(new BigNumber(0));
  const [amountUNI, setAmountUNI] = useState(new BigNumber(0));

  const BUSDToQSDRatio = pairBalanceBUSD.isZero() ? new BigNumber(1) : pairBalanceBUSD.div(pairBalanceQSD);
  const QSDToBUSDRatio = pairBalanceQSD.isZero() ? new BigNumber(1) : pairBalanceQSD.div(pairBalanceBUSD);

  const onChangeAmountBUSD = (amountBUSD) => {
    if (!amountBUSD) {
      setAmountQSD(new BigNumber(0));
      setAmountBUSD(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountBUSDBN = new BigNumber(amountBUSD)
    setAmountBUSD(amountBUSDBN);

    const amountBUSDBU = toBaseUnitBN(amountBUSDBN, BUSD.decimals);
    const newAmountQSD = toTokenUnitsBN(
      amountBUSDBU.multipliedBy(QSDToBUSDRatio).integerValue(BigNumber.ROUND_FLOOR),
      BUSD.decimals);
    setAmountQSD(newAmountQSD);

    const newAmountQSDBU = toBaseUnitBN(newAmountQSD, QSD.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceQSDBU = toBaseUnitBN(pairBalanceQSD, QSD.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountQSDBU).div(pairBalanceQSDBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  const onChangeAmountQSD = (amountQSD) => {
    if (!amountQSD) {
      setAmountQSD(new BigNumber(0));
      setAmountBUSD(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountQSDBN = new BigNumber(amountQSD)
    setAmountQSD(amountQSDBN);

    const amountQSDBU = toBaseUnitBN(amountQSDBN, QSD.decimals);
    const newAmountBUSD = toTokenUnitsBN(
      amountQSDBU.multipliedBy(BUSDToQSDRatio).integerValue(BigNumber.ROUND_FLOOR),
      QSD.decimals);
    setAmountBUSD(newAmountBUSD);

    const newAmountBUSDBU = toBaseUnitBN(newAmountBUSD, BUSD.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceBUSDBU = toBaseUnitBN(pairBalanceBUSD, BUSD.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountBUSDBU).div(pairBalanceBUSDBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  return (
    <Box heading="Add Liquidity">
      <div style={{ display: 'flex' }}>
        {/* Pool Status */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="BUSD Balance" balance={userBalanceBUSD} />
        </div>
        {/* Add liquidity to pool */}
        <div style={{ width: '70%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <>
                <BigNumberInput
                  adornment="QSD"
                  value={amountQSD}
                  setter={onChangeAmountQSD}
                />
                <MaxButton
                  onClick={() => {
                    onChangeAmountQSD(userBalanceQSD);
                  }}
                />
              </>
            </div>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <BigNumberInput
                adornment="BUSD"
                value={amountBUSD}
                setter={onChangeAmountBUSD}
              />
              <PriceSection label="Mint " amt={amountUNI} symbol=" Pool Tokens" />
            </div>
            <div style={{ width: '30%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Add Liquidity"
                onClick={() => {
                  const amountQSDBU = toBaseUnitBN(amountQSD, QSD.decimals);
                  const amountBUSDBU = toBaseUnitBN(amountBUSD, BUSD.decimals);
                  addLiquidity(
                    amountQSDBU,
                    amountBUSDBU,
                    SLIPPAGE,
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


export default AddLiquidity;
