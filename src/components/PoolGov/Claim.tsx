import BigNumber from 'bignumber.js';
import React from 'react';
import { BalanceBlock, TopBorderSection } from '../common';
import { Button } from '@aragon/ui';
import { claimGovRewards } from '../../utils/web3';
import { toBaseUnitBN } from '../../utils/number';
import { SCD } from '../../constants/tokens';

interface ClaimProps {
  poolAddress: string | null;
  userStatus: number;
  amountSCD: BigNumber;
}

export const Claim: React.FC<ClaimProps> = ({
  userStatus,
  poolAddress,
  amountSCD,
}) => (
  <TopBorderSection title='Claim'>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <BalanceBlock asset='Claimable' balance={amountSCD} suffix={'SCD'} />
      </div>
      <Button
        // wide
        icon={<i className='far fa-hand-point-right' />}
        label='Claim'
        onClick={() => claimGovRewards(poolAddress, toBaseUnitBN(amountSCD, SCD.decimals))}
        disabled={!poolAddress || (userStatus && userStatus !== 0)}
      />
    </div>
    <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
      <span style={{ opacity: 0.5 }}>
        Unbond to make rewards claimable after your status is Unlocked
      </span>
    </div>
  </TopBorderSection>
);
