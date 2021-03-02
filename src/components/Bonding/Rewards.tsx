import BigNumber from 'bignumber.js';
import React from 'react';
import { BalanceBlock, TopBorderSection } from '../common';
import { Button } from '@aragon/ui';
import { pokeRewards } from '../../utils/web3';

interface RewardsProps {
  poolAddress: string | null;
  amountSCD: BigNumber;
  amountQSG: BigNumber;
}

export const Rewards: React.FC<RewardsProps> = ({ poolAddress, amountSCD, amountQSG }) => (
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
      <div>
        <BalanceBlock asset='Rewarded' balance={amountQSG} suffix={'QSG'} />
      </div>
      <Button
        // wide
        icon={<i className='far fa-hand-point-right' />}
        label='Poke'
        onClick={() => pokeRewards(poolAddress)}
        disabled={!poolAddress}
      />
    </div>
  </TopBorderSection>
);
