/* eslint-disable react-hooks/exhaustive-deps */

import { Layout } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SCD, SCDS, QSG } from '../../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getEpoch,
  getExpansionAmount,
  getInstantaneousSCDPrice,
  getPoolBalanceOfClaimable1,
  getPoolBalanceOfClaimable2,
  getPoolBalanceOfRewarded1,
  getPoolBalanceOfRewarded2,
  getPoolFluidUntil,
  getPoolStatusOf,
  getPoolTotalBonded,
  getTokenAllowance,
  getTokenBalance,
} from '../../utils/infura';
import { toBaseUnitBN, toFloat, toTokenUnitsBN } from '../../utils/number';
import { getPoolBondingAddress } from '../../utils/pool';
import {
  approve,
  bondPool,
  depositPool,
  unbondPool,
  withdrawPool,
} from '../../utils/web3';
import { BondUnbond, Guide, IconHeader, WithdrawDeposit } from '../common';
import { Claim } from './Claim';
import AccountPageHeader from './Header';
import { Rewards } from './Rewards';

function Bonding({ user }: { user: string }) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [epoch, setEpoch] = useState<number>(0);
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [poolBondingAddress, setPoolBondingAddress] = useState<null | string>(
    null
  );
  const [userSCDBalance, setUserSCDBalance] = useState(new BigNumber(0));
  const [userSCDAllowance, setUserSCDAllowance] = useState(new BigNumber(0));
  const [userSCDSBalance, setUserSCDSBalance] = useState(new BigNumber(0));
  const [totalSCDSSupply, setTotalSCDSSupply] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);
  const [userRewardedSCD, setUserRewardedSCD] = useState(new BigNumber(0));
  const [userRewardedQSG, setUserRewardedQSG] = useState(new BigNumber(0));
  const [userClaimableSCD, setUserClaimableSCD] = useState(new BigNumber(0));
  const [userClaimableQSG, setUserClaimableQSG] = useState(new BigNumber(0));

  const [SCDPrice, setSCDPrice] = useState<BigNumber | null>(null);
  const [expansionAmount, setExpansionAmount] = useState<number | null>(null);

  //APR and stuff
  useEffect(() => {
    const updateAPR = async () => {
      const poolBonding = await getPoolBondingAddress();

      const [
        epoch,
        SCDPrice,
        expansionAmount,
        totalBonded,
      ] = await Promise.all([
        getEpoch(SCDS.addr),
        getInstantaneousSCDPrice(),
        getExpansionAmount(),
        getPoolTotalBonded(poolBonding),
      ]);

      setEpoch(parseInt(epoch, 10));
      setSCDPrice(SCDPrice);
      setExpansionAmount(expansionAmount);
      setTotalSCDSSupply(new BigNumber(totalSCDSSupply));
      setTotalBonded(toTokenUnitsBN(totalBonded, SCD.decimals));
    };

    updateAPR();
  }, []);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setUserSCDBalance(new BigNumber(0));
      setUserSCDAllowance(new BigNumber(0));
      setUserSCDSBalance(new BigNumber(0));
      setTotalSCDSSupply(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolBondingAddress();

      const [
        poolTotalBondedStr,
        SCDBalance,
        SCDAllowance,
        stagedBalance,
        bondedBalance,
        status,
        fluidUntilStr,
        SCDRewardedStr,
        qsgRewardedStr,
        SCDClaimableStr,
        qsgClaimableStr,
        SCDsBalance,
      ] = await Promise.all([
        getPoolTotalBonded(poolAddress),
        getTokenBalance(SCD.addr, user),
        getTokenAllowance(SCD.addr, user, poolAddress),
        getBalanceOfStaged(poolAddress, user),
        getBalanceBonded(poolAddress, user),
        getPoolStatusOf(poolAddress, user),
        getPoolFluidUntil(poolAddress, user),
        getPoolBalanceOfRewarded1(poolAddress, user),
        getPoolBalanceOfRewarded2(poolAddress, user),
        getPoolBalanceOfClaimable1(poolAddress, user),
        getPoolBalanceOfClaimable2(poolAddress, user),
        getTokenBalance(SCDS.addr, user),
      ]);

      const SCDRewarded = toTokenUnitsBN(SCDRewardedStr, SCD.decimals);
      const qsgRewarded = toTokenUnitsBN(qsgRewardedStr, QSG.decimals);
      const SCDClaimable = toTokenUnitsBN(SCDClaimableStr, SCD.decimals);
      const qsgClaimable = toTokenUnitsBN(qsgClaimableStr, QSG.decimals);
      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, SCD.decimals);
      const userSCDBalance = toTokenUnitsBN(SCDBalance, SCD.decimals);
      const userSCDSBalance = SCDsBalance;
      const userStagedBalance = toTokenUnitsBN(stagedBalance, SCDS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, SCDS.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);

      if (!isCancelled) {
        setTotalBonded(poolTotalBonded);
        setPoolBondingAddress(poolAddress);
        setUserSCDBalance(new BigNumber(userSCDBalance));
        setUserSCDAllowance(new BigNumber(SCDAllowance));
        setUserSCDSBalance(new BigNumber(userSCDSBalance));
        setTotalSCDSSupply(new BigNumber(totalSCDSSupply));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserRewardedSCD(new BigNumber(SCDRewarded));
        setUserRewardedQSG(new BigNumber(qsgRewarded));
        setUserClaimableSCD(new BigNumber(SCDClaimable));
        setUserClaimableQSG(new BigNumber(qsgClaimable));
        setUserStatus(userStatus);
        setUserStatusUnlocked(fluidUntil);
        setLockup(POOL_EXIT_LOCKUP_EPOCHS);
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

  let bondingWeeklyYield = '...';
  let bondingHourlyYield = '...';
  let bondingDailyYield = '...';
  let bondingMonthlyYield = '...';

  // Define number formatting
  var options = { minimumFractionDigits: 0,
                maximumFractionDigits: 2 };
  var numberFormat = new Intl.NumberFormat('en-US', options);

  // Calculate DAO APR (4 hrs)
  if (SCDPrice && totalBonded && expansionAmount) {
    if (epoch > 72) {
      const totalSCD = toFloat(totalBonded);
      const SCDToAdd = expansionAmount / 2;

      const daoYield = (SCDToAdd / totalSCD) * 100;

      bondingHourlyYield = numberFormat.format(daoYield / 4) + '%';
      bondingDailyYield = numberFormat.format(daoYield * 6) + '%';
      bondingWeeklyYield = numberFormat.format(daoYield * 6 * 7) + '%';
      bondingMonthlyYield = numberFormat.format(daoYield * 6 * 30) + '%';
    } else {
      bondingHourlyYield = '0%';
      bondingDailyYield = '0%';
      bondingWeeklyYield = '0%';
      bondingMonthlyYield = '0%';
    }
  }

  return (
    <Layout>
      <Guide
        // bodyApr={
        //   <>
        //     <div>Hourly: {bondingHourlyYield}</div>
        //     <div>Daily: {bondingDailyYield}</div>
        //     <div>Weekly: {bondingWeeklyYield}</div>
        //   </>
        // }
        aprs={{
          hourly: bondingHourlyYield,
          daily: bondingDailyYield,
          weekly: bondingWeeklyYield,
          monthly: bondingMonthlyYield
        }}
        bodyInstructions={
            <p>

            Step 1: Stage your SCD
            <br />
            Step 2: Bond your SCD *Note that you can only bond SCD when TWAP is
            &lt;1*
            <br />
            &nbsp;&nbsp; 2.1: If TWAP is &lt;1, you'll be rewarded QSG
            <br />
            &nbsp;&nbsp; 2.2: If TWAP is &gt;=1, you'll be rewarded SCD
            <br />
            Step 3: Poke your rewards to move them to claimable
            <br />
            Step 4: Wait 1 epoch to claim claimable SCD and/or QSG
          </p>
        }
      />

      <IconHeader icon={<i className='fas fa-atom' />} text='SCD Rewards' />

      <AccountPageHeader
        accountSCDBalance={userSCDBalance}
        accountSCDSBalance={userSCDSBalance}
        totalBonded={totalBonded}
        accountStagedBalance={userStagedBalance}
        accountBondedBalance={userBondedBalance}
        accountStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      <WithdrawDeposit
        suffix='SCD'
        balance={userSCDBalance}
        allowance={userSCDAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
        disabled={!user}
        handleApprove={() => {
          approve(SCD.addr, poolBondingAddress);
        }}
        handleDeposit={(depositAmount) => {
          depositPool(
            poolBondingAddress,
            toBaseUnitBN(depositAmount, SCD.decimals),
            () => {}
          );
        }}
        handleWithdraw={(withdrawAmount) => {
          withdrawPool(
            poolBondingAddress,
            toBaseUnitBN(withdrawAmount, SCD.decimals),
            () => {}
          );
        }}
      />

      <BondUnbond
        extraTip={'Can only bond when SCD < 1 DAI.'}
        suffix='SCD'
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
        disabled={!user}
        handleBond={(bondAmount) => {
          bondPool(
            poolBondingAddress,
            toBaseUnitBN(bondAmount, SCD.decimals),
            () => {}
          );
        }}
        handleUnbond={(unbondAmount) => {
          unbondPool(
            poolBondingAddress,
            toBaseUnitBN(unbondAmount, SCD.decimals),
            () => {}
          );
        }}
      />

      <Claim
        userStatus={userStatus}
        poolAddress={poolBondingAddress}
        amountSCD={userClaimableSCD}
        amountQSG={userClaimableQSG}
      />

      <Rewards
        poolAddress={poolBondingAddress}
        amountSCD={userRewardedSCD}
        amountQSG={userRewardedQSG}
      />
    </Layout>
  );
}

export default Bonding;
