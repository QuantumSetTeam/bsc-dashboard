import React, {useEffect, useState} from 'react';
import BigNumber from "bignumber.js";
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getPoolBalanceOfBonded, getPoolBalanceOfClaimable, getPoolBalanceOfRewarded, getPoolBalanceOfStaged,
  getTokenBalance,
  getTokenTotalSupply
} from "../../utils/infura";
import {SCD, SCDS, UNI} from "../../constants/tokens";
import { toTokenUnitsBN} from "../../utils/number";
import {getPoolBondingAddress} from "../../utils/pool";
import { formatBN } from '../../utils/number';


type TotalBalanceProps = {
  user: string,
}

function TotalBalance({ user }: TotalBalanceProps) {
  // const [totalBalance, setTotalBalance] = useState(new BigNumber(0));

  const [totalBalance, setTotalBalance] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    // if (user === '') {
    //   setTotalBalance(new BigNumber(0));
    //   return;
    // }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolBondingAddress();

      const [
        esdBalance, stagedBalance, bondedBalance,
        pairBalanceSCDStr, pairTotalSupplyUNIStr, userUNIBalanceStr,
        userPoolBondedBalanceStr, userPoolStagedBalanceStr,
        userPoolRewardedBalanceStr, userPoolClaimableBalanceStr,
      ] = await Promise.all([
        getTokenBalance(SCD.addr, user),
        getBalanceOfStaged(SCDS.addr, user),
        getBalanceBonded(SCDS.addr, user),

        getTokenBalance(SCD.addr, UNI.addr),
        getTokenTotalSupply(UNI.addr),
        getTokenBalance(UNI.addr, user),
        getPoolBalanceOfBonded(poolAddress, user),
        getPoolBalanceOfStaged(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
      ]);

      const userBalance = toTokenUnitsBN(esdBalance, SCD.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, SCDS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, SCDS.decimals);

      const userUNIBalance = toTokenUnitsBN(userUNIBalanceStr, SCDS.decimals);
      const userPoolBondedBalance = toTokenUnitsBN(userPoolBondedBalanceStr, SCDS.decimals);
      const userPoolStagedBalance = toTokenUnitsBN(userPoolStagedBalanceStr, SCDS.decimals);
      const userPoolRewardedBalance = toTokenUnitsBN(userPoolRewardedBalanceStr, SCDS.decimals);
      const userPoolClaimableBalance = toTokenUnitsBN(userPoolClaimableBalanceStr, SCDS.decimals);

      const UNItoSCD = new BigNumber(pairBalanceSCDStr).dividedBy(new BigNumber(pairTotalSupplyUNIStr));

      const daoTotalBalance = userStagedBalance.plus(userBondedBalance);
      const poolTotalBalance = UNItoSCD.multipliedBy(userPoolStagedBalance.plus(userPoolBondedBalance))
        .plus(userPoolRewardedBalance.plus(userPoolClaimableBalance));
      const circulationBalance = UNItoSCD.multipliedBy(userUNIBalance).plus(userBalance)

      const totalBalance = daoTotalBalance.plus(poolTotalBalance).plus(circulationBalance)

      if (!isCancelled) {
        setTotalBalance(totalBalance);
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
    <div style={{ fontSize: 14, padding: 3, fontWeight: 400, lineHeight: 1.5, fontFamily: 'aragon-ui-monospace, monospace', display : "none"}}>
      ${formatBN(totalBalance, 2)}
    </div>
    
  );
}


export default TotalBalance;
