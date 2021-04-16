import React, { useState, useEffect } from 'react';
import { Header, Layout } from '@aragon/ui';

import {
    getPoolTotalBonded,
    getLPPoolTotalClaimable1,
    getLPPoolTotalRewarded1,
    getPoolTotalStaged,
    getTokenBalance,
    getTokenTotalSupply,
} from '../../utils/infura';
import {
    QSD,
    UNI,
    newPoolBondingAdd,
    newPoolLPAdd,
} from '../../constants/tokens';
import { toTokenUnitsBN } from '../../utils/number';
import BigNumber from 'bignumber.js';
import RegulationHeader from './Header';
import RegulationHistory from './RegulationHistory';
import IconHeader from '../common/IconHeader';

function Regulation({
    user,
    hideHistory,
}: {
    user: string;
    hideHistory?: boolean;
}) {
    const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
    const [daoBonded, setTotalBonded] = useState(new BigNumber(0));
    const [daoStaged, setTotalStaged] = useState(new BigNumber(0));
    const [poolLPLiquidity, setPoolLiquidity] = useState(new BigNumber(0));
    const [poolTotalRewarded, setPoolTotalRewarded] = useState(
        new BigNumber(0)
    );
    const [poolTotalClaimable, setPoolTotalClaimable] = useState(
        new BigNumber(0)
    );

    useEffect(() => {
        let isCancelled = false;

        async function updateUserInfo() {
            const poolBondingAddress = newPoolBondingAdd.addr;
            const poolLpAddress = newPoolLPAdd.addr;

            const [
                totalSupplyStr,
                poolLiquidityStr,
                poolTotalBondedStr,
                poolTotalStagedStr,
                poolTotalRewarded1Str,
                poolTotalClaimable1Str,
            ] = await Promise.all([
                getTokenTotalSupply(QSD.addr),

                getTokenBalance(QSD.addr, UNI.addr),

                getPoolTotalBonded(poolBondingAddress),
                getPoolTotalStaged(poolBondingAddress),

                getLPPoolTotalRewarded1(poolLpAddress),
                getLPPoolTotalClaimable1(poolLpAddress),
            ]);

            if (!isCancelled) {
                setTotalSupply(toTokenUnitsBN(totalSupplyStr, QSD.decimals));

                setTotalBonded(
                    toTokenUnitsBN(poolTotalBondedStr, QSD.decimals)
                );
                setTotalStaged(
                    toTokenUnitsBN(poolTotalStagedStr, QSD.decimals)
                );

                setPoolLiquidity(
                    toTokenUnitsBN(poolLiquidityStr, QSD.decimals)
                );
                setPoolTotalRewarded(
                    toTokenUnitsBN(poolTotalRewarded1Str, QSD.decimals)
                );
                setPoolTotalClaimable(
                    toTokenUnitsBN(poolTotalClaimable1Str, QSD.decimals)
                );
            }
        }
        updateUserInfo();
        const id = setInterval(updateUserInfo, 15000);

        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true;
            clearInterval(id);
        };
    }, [user]);

    return (
        <Layout>
            <IconHeader
                icon={<i className='fas fa-chart-area' />}
                text='Supply Regulation'
            />

            <RegulationHeader
                totalSupply={totalSupply}
                daoBonded={daoBonded}
                daoStaged={daoStaged}
                poolLPLiquidity={poolLPLiquidity}
                poolLPRewarded={poolTotalRewarded}
                poolLPClaimable={poolTotalClaimable}
            />

            {!hideHistory && (
                <>
                    <Header primary='Regulation History' />
                    <RegulationHistory user={user} />
                </>
            )}
        </Layout>
    );
}

export default Regulation;
