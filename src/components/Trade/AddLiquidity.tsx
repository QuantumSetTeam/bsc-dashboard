import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Button, IconCirclePlus } from '@aragon/ui';
import { addLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {SCD, UNI, DAI} from "../../constants/tokens";
import {SLIPPAGE} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type AddliquidityProps = {
  userBalanceSCD: BigNumber,
  userBalanceDAI: BigNumber,
  pairBalanceSCD: BigNumber,
  pairBalanceDAI: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}

function AddLiquidity({
  userBalanceSCD,
  userBalanceDAI,
  pairBalanceSCD,
  pairBalanceDAI,
  pairTotalSupplyUNI,
}: AddliquidityProps) {
  const [amountDAI, setAmountDAI] = useState(new BigNumber(0));
  const [amountSCD, setAmountSCD] = useState(new BigNumber(0));
  const [amountUNI, setAmountUNI] = useState(new BigNumber(0));

  const DAIToSCDRatio = pairBalanceDAI.isZero() ? new BigNumber(1) : pairBalanceDAI.div(pairBalanceSCD);
  const SCDToDAIRatio = pairBalanceSCD.isZero() ? new BigNumber(1) : pairBalanceSCD.div(pairBalanceDAI);

  const onChangeAmountDAI = (amountDAI) => {
    if (!amountDAI) {
      setAmountSCD(new BigNumber(0));
      setAmountDAI(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountDAIBN = new BigNumber(amountDAI)
    setAmountDAI(amountDAIBN);

    const amountDAIBU = toBaseUnitBN(amountDAIBN, DAI.decimals);
    const newAmountSCD = toTokenUnitsBN(
      amountDAIBU.multipliedBy(SCDToDAIRatio).integerValue(BigNumber.ROUND_FLOOR),
      DAI.decimals);
    setAmountSCD(newAmountSCD);

    const newAmountSCDBU = toBaseUnitBN(newAmountSCD, SCD.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceSCDBU = toBaseUnitBN(pairBalanceSCD, SCD.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountSCDBU).div(pairBalanceSCDBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  const onChangeAmountSCD = (amountSCD) => {
    if (!amountSCD) {
      setAmountSCD(new BigNumber(0));
      setAmountDAI(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountSCDBN = new BigNumber(amountSCD)
    setAmountSCD(amountSCDBN);

    const amountSCDBU = toBaseUnitBN(amountSCDBN, SCD.decimals);
    const newAmountDAI = toTokenUnitsBN(
      amountSCDBU.multipliedBy(DAIToSCDRatio).integerValue(BigNumber.ROUND_FLOOR),
      SCD.decimals);
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
                  adornment="SCD"
                  value={amountSCD}
                  setter={onChangeAmountSCD}
                />
                <MaxButton
                  onClick={() => {
                    onChangeAmountSCD(userBalanceSCD);
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
                  const amountSCDBU = toBaseUnitBN(amountSCD, SCD.decimals);
                  const amountDAIBU = toBaseUnitBN(amountDAI, DAI.decimals);
                  addLiquidity(
                    amountSCDBU,
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
