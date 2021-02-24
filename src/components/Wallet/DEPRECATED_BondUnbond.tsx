import React, { useState } from 'react';
import {
  Box,
  Button,
  IconCirclePlus,
  IconCircleMinus,
  IconCaution,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { BalanceBlock, MaxButton } from '../common';
import { bond, unbondUnderlying } from '../../utils/web3';
import { isPos, toBaseUnitBN } from '../../utils/number';
import { QSD, QSDS } from '../../constants/tokens';
import BigNumberInput from '../common/BigNumberInput';
import TextBlock from '../common/TextBlock';

type BondUnbondProps = {
  staged: BigNumber;
  bonded: BigNumber;
  status: number;
  lockup: number;
};

function BondUnbond({ staged, bonded, status, lockup }: BondUnbondProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));

  return (
    <Box heading='Bond'>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Total bonded */}
        <div style={{ flexBasis: '16%' }}>
          <BalanceBlock asset='Bonded' balance={bonded} suffix={'QSD'} />
        </div>
        {/* Total bonded */}
        <div style={{ flexBasis: '16%' }}>
          <TextBlock
            label='Exit Lockup'
            text={
              lockup === 0 ? '' : lockup === 1 ? '1 epoch' : `${lockup} epochs`
            }
          />
        </div>
        {/* Bond QSD within DAO */}
        <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', minWidth: '6em' }}>
              <>
                <BigNumberInput
                  adornment='QSD'
                  value={bondAmount}
                  setter={setBondAmount}
                />
                <MaxButton
                  onClick={() => {
                    setBondAmount(staged);
                  }}
                />
              </>
            </div>
            <div style={{ width: '40%', minWidth: '7em' }}>
              <Button
                wide
                icon={status === 0 ? <IconCirclePlus /> : <IconCaution />}
                label='Bond'
                onClick={() => {
                  bond(QSDS.addr, toBaseUnitBN(bondAmount, QSD.decimals));
                }}
                disabled={
                  status === 2 ||
                  !isPos(bondAmount) ||
                  bondAmount.isGreaterThan(staged)
                }
              />
            </div>
          </div>
        </div>
        <div style={{ width: '2%' }} />
        {/* Unbond QSD within DAO */}
        <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', minWidth: '6em' }}>
              <>
                <BigNumberInput
                  adornment='QSD'
                  value={unbondAmount}
                  setter={setUnbondAmount}
                />
                <MaxButton
                  onClick={() => {
                    setUnbondAmount(bonded);
                  }}
                />
              </>
            </div>
            <div style={{ width: '40%', minWidth: '7em' }}>
              <Button
                wide
                icon={status === 0 ? <IconCircleMinus /> : <IconCaution />}
                label='Unbond'
                onClick={() => {
                  unbondUnderlying(
                    QSDS.addr,
                    toBaseUnitBN(unbondAmount, QSD.decimals)
                  );
                }}
                disabled={
                  status === 2 ||
                  !isPos(unbondAmount) ||
                  unbondAmount.isGreaterThan(bonded)
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
        <span style={{ opacity: 0.5 }}>
          {' '}
          Bonding events will restart the lockup timer{' '}
        </span>
      </div>
    </Box>
  );
}

export default BondUnbond;
