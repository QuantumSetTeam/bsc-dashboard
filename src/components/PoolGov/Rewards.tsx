import BigNumber from 'bignumber.js';
import React from 'react';
import { BalanceBlock, TopBorderSection } from '../common';

interface RewardsProps {
  poolAddress: string | null;
  amountSCD: BigNumber;
}

export const Rewards: React.FC<RewardsProps> = ({ poolAddress, amountSCD }) => (
  <TopBorderSection title='Rewards'>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <BalanceBlock asset='Rewarded' balance={amountSCD} suffix={'SCD'} />
      </div>
    </div>
    <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
      <span style={{ opacity: 0.5 }}>
        Unbond to move rewards to claimable
      </span>
    </div>
  </TopBorderSection>
);
