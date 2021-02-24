import {
  Button,
  IconCaution,
  IconCircleMinus,
  IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { isPos } from '../../utils/number';
import { BalanceBlock, MaxButton } from '../common';
import BigNumberInput from '../common/BigNumberInput';
import TextBlock from '../common/TextBlock';
import { TopBorderSection } from './TopBorderSection';

interface BondUnbondProps {
  suffix: string;
  extraTip?: string;
  staged: BigNumber;
  bonded: BigNumber;
  status: number;
  lockup: number;
  disabled: boolean;
  handleBond: (bondAmount: BigNumber, callback: () => void) => void;
  handleUnbond: (unbondAmount: BigNumber, callback: () => void) => void;
}

export const BondUnbond: React.FC<BondUnbondProps> = ({
  suffix,
  extraTip,
  staged,
  bonded,
  status,
  lockup,
  disabled,
  handleBond,
  handleUnbond,
}) => {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));

  return (
    <TopBorderSection title='Bond'>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Total bonded */}
        <div style={{ flexBasis: '16%' }}>
          <BalanceBlock asset='Bonded' balance={bonded} suffix={suffix} />
        </div>
        {/* Exit lockup */}
        <div style={{ flexBasis: '16%' }}>
          <TextBlock
            label='Exit Lockup'
            text={
              lockup === 0 ? '' : lockup === 1 ? '1 epoch' : `${lockup} epochs`
            }
          />
        </div>
        {/* Bond UNI-V2 within Pool */}
        <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', minWidth: '6em' }}>
              <>
                <BigNumberInput
                  adornment={suffix}
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
                  handleBond(bondAmount, () => {
                    setBondAmount(new BigNumber(0));
                  });
                }}
                disabled={!isPos(bondAmount) || disabled}
              />
            </div>
          </div>
        </div>
        <div style={{ flexBasis: '2%' }} />
        {/* Unbond UNI-V2 within Pool */}
        <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', minWidth: '6em' }}>
              <>
                <BigNumberInput
                  adornment={suffix}
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
                  handleUnbond(unbondAmount, () => {
                    setUnbondAmount(new BigNumber(0));
                  });
                }}
                disabled={!isPos(unbondAmount) || disabled}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
        <span style={{ opacity: 0.5 }}>
          Bonding events will restart the lockup timer.{' '}
          {extraTip && extraTip}
        </span>
      </div>
    </TopBorderSection>
  );
};
