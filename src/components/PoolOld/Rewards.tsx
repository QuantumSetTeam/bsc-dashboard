import BigNumber from 'bignumber.js';
import React from 'react';
import { BalanceBlock, TopBorderSection } from '../common';
import { Button } from '@aragon/ui';
import { pokeRewards } from '../../utils/web3';

interface RewardsProps {
    poolAddress: string | null;
    amountQSD: BigNumber;
}

export const Rewards: React.FC<RewardsProps> = ({ poolAddress, amountQSD }) => (
    <TopBorderSection title='Rewards'>
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div>
                <BalanceBlock
                    asset='Rewarded'
                    balance={amountQSD}
                    suffix={'QSD'}
                />
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
