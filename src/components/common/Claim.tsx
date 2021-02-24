import { Button, IconArrowDown } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { isPos } from '../../utils/number';
import BigNumberInput from '../common/BigNumberInput';
import { BalanceBlock, MaxButton, TopBorderSection } from '../common/index';

interface ClaimProps {
  suffix: string;
  claimable: BigNumber;
  status: number;
  disabled: boolean;
  handleClaim: (claimAmount: BigNumber, callback: () => void) => void;
}

export const Claim: React.FC<ClaimProps> = ({
  suffix,
  claimable,
  status,
  disabled,
  handleClaim,
}) => {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0));

  return (
    <TopBorderSection title='Claim'>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* total Issued */}
        <div style={{ flexBasis: '32%' }}>
          <BalanceBlock asset='Claimable' balance={claimable} suffix={suffix} />
        </div>
        {/* Deposit UNI-V2 into Pool */}
        <div style={{ flexBasis: '35%' }} />
        <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%', minWidth: '6em' }}>
              <>
                <BigNumberInput
                  adornment={suffix}
                  value={claimAmount}
                  setter={setClaimAmount}
                  disabled={status !== 0}
                />
                <MaxButton
                  onClick={() => {
                    setClaimAmount(claimable);
                  }}
                />
              </>
            </div>
            <div style={{ width: '40%', minWidth: '6em' }}>
              <Button
                wide
                icon={<IconArrowDown />}
                label='Claim'
                onClick={() => {
                  handleClaim(claimAmount, () => {
                    setClaimAmount(new BigNumber(0));
                  });
                }}
                disabled={status !== 0 || !isPos(claimAmount) || disabled}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
        <span style={{ opacity: 0.5 }}>
          Unbond to make rewards claimable after your status is Unlocked
        </span>
      </div>
    </TopBorderSection>
  );
};
