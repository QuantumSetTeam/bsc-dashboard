import React, { useState } from 'react';
import {
  Tabs,
  Button,
  IconArrowUp,
  IconCirclePlus,
  useTheme,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock,
  MaxButton,
  PriceSection,
  TopBorderSection,
} from '../common';
import {
  approve,
  providePool,
  providePoolOptimalOneSided,
} from '../../utils/web3';
import { isPos, toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
import { SCD, DAI } from '../../constants/tokens';
import { MAX_UINT256 } from '../../constants/values';
import BigNumberInput from '../common/BigNumberInput';

type ProvideProps = {
  poolAddress: string;
  user: string;
  rewarded: BigNumber;
  pairBalanceSCD: BigNumber;
  pairBalanceDAI: BigNumber;
  userDAIBalance: BigNumber;
  userDAIAllowance: BigNumber;
  status: number;
};

function Provide({
  poolAddress,
  user,
  rewarded,
  pairBalanceSCD,
  pairBalanceDAI,
  userDAIBalance,
  userDAIAllowance,
  status,
}: ProvideProps) {
  const theme = useTheme();
  const isDark = theme._name === 'dark';
  const [useSCD, setUseSCD] = useState(0);
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0));

  const DAIToSCDRatio = pairBalanceDAI.isZero()
    ? new BigNumber(1)
    : pairBalanceDAI.div(pairBalanceSCD);

  const onChangeAmountSCD = (amountSCD) => {
    if (!amountSCD) {
      setProvideAmount(new BigNumber(0));
      setUsdcAmount(new BigNumber(0));
      return;
    }

    const amountSCDBN = new BigNumber(amountSCD);
    setProvideAmount(amountSCDBN);

    const amountSCDBU = toBaseUnitBN(amountSCDBN, SCD.decimals);
    const newAmountDAI = toTokenUnitsBN(
      amountSCDBU
        .multipliedBy(DAIToSCDRatio)
        .integerValue(BigNumber.ROUND_FLOOR),
      SCD.decimals
    );
    setUsdcAmount(newAmountDAI);
  };

  return (
    <TopBorderSection title='Provide'>
      <div
        style={{ width: 'auto', margin: '0 auto' }}
        className={isDark ? 'tabs-container-dark' : undefined}
      >
        <Tabs
          items={['Dual Supply (with DAI)', 'Single Supply']}
          selected={useSCD}
          onChange={setUseSCD}
        />
      </div>
      {userDAIAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 || useSCD ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* total rewarded */}
          <div style={{ flexBasis: '32%' }}>
            <BalanceBlock asset='Rewarded' balance={rewarded} suffix={'SCD'} />
          </div>
          <div style={{ flexBasis: '35%' }}></div>
          {/* Provide liquidity using Pool rewards */}
          <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '60%', minWidth: '6em' }}>
                <>
                  <BigNumberInput
                    adornment='SCD'
                    value={provideAmount}
                    setter={onChangeAmountSCD}
                    disabled={status === 1}
                  />
                  {!useSCD && (
                    <PriceSection
                      label='Requires '
                      amt={usdcAmount}
                      symbol=' DAI'
                    />
                  )}
                  <MaxButton
                    onClick={() => {
                      onChangeAmountSCD(rewarded);
                    }}
                  />
                </>
              </div>
              <div style={{ width: '40%', minWidth: '6em' }}>
                <Button
                  wide
                  icon={<IconArrowUp />}
                  label='Provide'
                  onClick={() => {
                    if (useSCD) {
                      providePoolOptimalOneSided(
                        poolAddress,
                        toBaseUnitBN(provideAmount, SCD.decimals),
                        (hash) => setProvideAmount(new BigNumber(0))
                      );
                    } else {
                      providePool(
                        poolAddress,
                        toBaseUnitBN(provideAmount, SCD.decimals),
                        (hash) => setProvideAmount(new BigNumber(0))
                      );
                    }
                  }}
                  disabled={
                    poolAddress === '' ||
                    status !== 0 ||
                    !isPos(provideAmount) ||
                    provideAmount.isGreaterThan(rewarded)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* total rewarded */}
          <div style={{ flexBasis: '32%' }}>
            <BalanceBlock asset='Rewarded' balance={rewarded} suffix={'SCD'} />
          </div>
          <div style={{ flexBasis: '33%' }}>
            <BalanceBlock
              asset='DAI Balance'
              balance={userDAIBalance}
              suffix={'DAI'}
            />
          </div>
          <div style={{ flexBasis: '2%' }} />
          {/* Approve Pool to spend DAI */}
          <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
            <Button
              wide
              icon={<IconCirclePlus />}
              label='Approve'
              onClick={() => {
                approve(DAI.addr, poolAddress);
              }}
              disabled={poolAddress === '' || user === ''}
            />
          </div>
        </div>
      )}
      <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
        <span style={{ opacity: 0.5 }}>
          {useSCD
            ? 'Zap your rewards directly'
            : 'Zap your rewards directly to LP by providing more DAI'}
        </span>
      </div>
    </TopBorderSection>
  );
}

export default Provide;
