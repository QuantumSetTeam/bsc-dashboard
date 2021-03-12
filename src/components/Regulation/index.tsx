import React, { useState, useEffect } from 'react';
import { Header, Layout } from '@aragon/ui';

import {
  getDaoIsBootstrapping,
  getPoolTotalBonded,
  getTotalClaimable,
  getTotalRewarded,
  getPoolTotalStaged,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBonded,
  getTotalStaged,
} from '../../utils/infura';
import { QSD, QSDS, UNI } from '../../constants/tokens';
import { toTokenUnitsBN } from '../../utils/number';
import BigNumber from 'bignumber.js';
import RegulationHeader from './Header';
import RegulationHistory from './RegulationHistory';
import IconHeader from '../common/IconHeader';
import { getPoolBondingAddress, getPoolLPAddress } from '../../utils/pool';

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
  const [poolTotalRewarded, setPoolTotalRewarded] = useState(new BigNumber(0));
  const [poolTotalClaimable, setPoolTotalClaimable] = useState(
    new BigNumber(0)
  );

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const poolBondingAddress = await getPoolBondingAddress();
      const poolLpAddress = await getPoolLPAddress()

      const [
        totalSupplyStr,
        totalBondedStr,
        totalStagedStr,
        poolLiquidityStr,
        poolTotalBondedStr,
        poolTotalStagedStr,
        poolTotalRewardedStr,
        poolTotalClaimableStr,
        bootstrapping,
      ] = await Promise.all([
        getTokenTotalSupply(QSD.addr),

        getTotalBonded(QSDS.addr),
        getTotalStaged(QSDS.addr),

        getTokenBalance(QSD.addr, UNI.addr),

        getPoolTotalBonded(poolBondingAddress),
        getPoolTotalStaged(poolBondingAddress),

        getTotalRewarded(poolLpAddress),
        getTotalClaimable(poolLpAddress),

        getDaoIsBootstrapping(),
      ]);

      if (!isCancelled) {
        setTotalSupply(toTokenUnitsBN(totalSupplyStr, QSD.decimals));

        if (bootstrapping) {
          setTotalBonded(toTokenUnitsBN(totalBondedStr, QSD.decimals));
          setTotalStaged(toTokenUnitsBN(totalStagedStr, QSD.decimals));
        } else {
          setTotalBonded(toTokenUnitsBN(poolTotalBondedStr, QSD.decimals));
          setTotalStaged(toTokenUnitsBN(poolTotalStagedStr, QSD.decimals));
        }

        setPoolLiquidity(toTokenUnitsBN(poolLiquidityStr, QSD.decimals));
        setPoolTotalRewarded(
          toTokenUnitsBN(poolTotalRewardedStr, QSD.decimals)
        );
        setPoolTotalClaimable(
          toTokenUnitsBN(poolTotalClaimableStr, QSD.decimals)
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
