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
import { QSD, DAI } from '../../constants/tokens';
import { MAX_UINT256 } from '../../constants/values';
import BigNumberInput from '../common/BigNumberInput';

type ProvideProps = {
  poolAddress: string;
  user: string;
  rewarded: BigNumber;
  pairBalanceQSD: BigNumber;
  pairBalanceDAI: BigNumber;
  userDAIBalance: BigNumber;
  userDAIAllowance: BigNumber;
  status: number;
};

function Provide({
  poolAddress,
  user,
  rewarded,
  pairBalanceQSD,
  pairBalanceDAI,
  userDAIBalance,
  userDAIAllowance,
  status,
}: ProvideProps) {
  const theme = useTheme();
  const isDark = theme._name === 'dark';
  const [useQSD, setUseQSD] = useState(0);
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0));

  const DAIToQSDRatio = pairBalanceDAI.isZero()
    ? new BigNumber(1)
    : pairBalanceDAI.div(pairBalanceQSD);

  const onChangeAmountQSD = (amountQSD) => {
    if (!amountQSD) {
      setProvideAmount(new BigNumber(0));
      setUsdcAmount(new BigNumber(0));
      return;
    }

    const amountQSDBN = new BigNumber(amountQSD);
    setProvideAmount(amountQSDBN);

    const amountQSDBU = toBaseUnitBN(amountQSDBN, QSD.decimals);
    const newAmountDAI = toTokenUnitsBN(
      amountQSDBU
        .multipliedBy(DAIToQSDRatio)
        .integerValue(BigNumber.ROUND_FLOOR),
      QSD.decimals
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
          selected={useQSD}
          onChange={setUseQSD}
        />
      </div>
      {userDAIAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 || useQSD ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* total rewarded */}
          <div style={{ flexBasis: '32%' }}>
            <BalanceBlock asset='Rewarded' balance={rewarded} suffix={'QSD'} />
          </div>
          <div style={{ flexBasis: '35%' }}></div>
          {/* Provide liquidity using Pool rewards */}
          <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '60%', minWidth: '6em' }}>
                <>
                  <BigNumberInput
                    adornment='QSD'
                    value={provideAmount}
                    setter={onChangeAmountQSD}
                    disabled={status === 1}
                  />
                  {!useQSD && (
                    <PriceSection
                      label='Requires '
                      amt={usdcAmount}
                      symbol=' DAI'
                    />
                  )}
                  <MaxButton
                    onClick={() => {
                      onChangeAmountQSD(rewarded);
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
                    if (useQSD) {
                      providePoolOptimalOneSided(
                        poolAddress,
                        toBaseUnitBN(provideAmount, QSD.decimals),
                        (hash) => setProvideAmount(new BigNumber(0))
                      );
                    } else {
                      providePool(
                        poolAddress,
                        toBaseUnitBN(provideAmount, QSD.decimals),
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
            <BalanceBlock asset='Rewarded' balance={rewarded} suffix={'QSD'} />
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
          {useQSD
            ? 'Zap your rewards directly'
            : 'Zap your rewards directly to LP by providing more DAI'}
        </span>
      </div>
    </TopBorderSection>
  );
}

export default Provide;
