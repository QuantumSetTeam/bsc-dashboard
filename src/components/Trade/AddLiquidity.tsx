import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Button, IconCirclePlus } from '@aragon/ui';
import { addLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {QSD, UNI, DAI} from "../../constants/tokens";
import {SLIPPAGE} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type AddliquidityProps = {
  userBalanceQSD: BigNumber,
  userBalanceDAI: BigNumber,
  pairBalanceQSD: BigNumber,
  pairBalanceDAI: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}

function AddLiquidity({
  userBalanceQSD,
  userBalanceDAI,
  pairBalanceQSD,
  pairBalanceDAI,
  pairTotalSupplyUNI,
}: AddliquidityProps) {
  const [amountDAI, setAmountDAI] = useState(new BigNumber(0));
  const [amountQSD, setAmountQSD] = useState(new BigNumber(0));
  const [amountUNI, setAmountUNI] = useState(new BigNumber(0));

  const DAIToQSDRatio = pairBalanceDAI.isZero() ? new BigNumber(1) : pairBalanceDAI.div(pairBalanceQSD);
  const QSDToDAIRatio = pairBalanceQSD.isZero() ? new BigNumber(1) : pairBalanceQSD.div(pairBalanceDAI);

  const onChangeAmountDAI = (amountDAI) => {
    if (!amountDAI) {
      setAmountQSD(new BigNumber(0));
      setAmountDAI(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountDAIBN = new BigNumber(amountDAI)
    setAmountDAI(amountDAIBN);

    const amountDAIBU = toBaseUnitBN(amountDAIBN, DAI.decimals);
    const newAmountQSD = toTokenUnitsBN(
      amountDAIBU.multipliedBy(QSDToDAIRatio).integerValue(BigNumber.ROUND_FLOOR),
      DAI.decimals);
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
      setAmountDAI(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountQSDBN = new BigNumber(amountQSD)
    setAmountQSD(amountQSDBN);

    const amountQSDBU = toBaseUnitBN(amountQSDBN, QSD.decimals);
    const newAmountDAI = toTokenUnitsBN(
      amountQSDBU.multipliedBy(DAIToQSDRatio).integerValue(BigNumber.ROUND_FLOOR),
      QSD.decimals);
    setAmountDAI(newAmountDAI);

    const newAmountDAIBU = toBaseUnitBN(newAmountDAI, DAI.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceDAIBU = toBaseUnitBN(pairBalanceDAI, DAI.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountDAIBU).div(pairBalanceDAIBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  return (
    <Box heading="Add Liquidity">
      <div style={{ display: 'flex' }}>
        {/* Pool Status */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="DAI Balance" balance={userBalanceDAI} />
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
                adornment="DAI"
                value={amountDAI}
                setter={onChangeAmountDAI}
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
                  const amountDAIBU = toBaseUnitBN(amountDAI, DAI.decimals);
                  addLiquidity(
                    amountQSDBU,
                    amountDAIBU,
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
