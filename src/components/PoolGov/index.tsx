/* eslint-disable react-hooks/exhaustive-deps */

import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SCD, SCDG } from '../../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import { Layout } from '@aragon/ui';
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getPoolFluidUntil,
  getPoolStatusOf,
  getPoolTotalBonded,
  getTokenAllowance,
  getTokenBalance,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfClaimable,
  getLockedUntil,
} from '../../utils/infura';
import { toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
import { getPoolGovAddress } from '../../utils/pool';
import {
  approve,
  bondPool,
  depositPool,
  unbondPool,
  withdrawPool,
} from '../../utils/web3';
import { BondUnbond, Guide, IconHeader, WithdrawDeposit } from '../common';
import AccountPageHeader from './Header';
import { Rewards } from './Rewards';
import { Claim } from './Claim';

function PoolGov({ user }: { user: string }) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [poolGovAddress, setPoolGovAddress] = useState<null | string>(null);
  const [userSCDGBalance, setUserSCDGBalance] = useState(new BigNumber(0));
  const [userSCDGAllowance, setUserSCDGAllowance] = useState(new BigNumber(0));
  const [totalSCDGSupply, setTotalSCDGSupply] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);
  const [userRewardedSCD, setUserRewardedSCD] = useState(new BigNumber(0));
  const [userClaimableSCD, setUserClaimableSCD] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setUserSCDGBalance(new BigNumber(0));
      setUserSCDGAllowance(new BigNumber(0));
      setUserSCDGBalance(new BigNumber(0));
      setTotalSCDGSupply(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolGovAddress();

      const [
        poolTotalBondedStr,
        SCDGBalance,
        SCDGAllowance,
        stagedBalance,
        bondedBalance,
        status,
        fluidUntilStr,
        lockedUntilStr,
        SCDRewardedStr,
        SCDClaimableStr,
      ] = await Promise.all([
        getPoolTotalBonded(poolAddress),
        getTokenBalance(SCDG.addr, user),
        getTokenAllowance(SCDG.addr, user, poolAddress),
        getBalanceOfStaged(poolAddress, user),
        getBalanceBonded(poolAddress, user),
        getPoolStatusOf(poolAddress, user),
        getPoolFluidUntil(poolAddress, user),
        getLockedUntil(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
      ]);

      const SCDRewarded = toTokenUnitsBN(SCDRewardedStr, SCD.decimals);
      const SCDClaimable = toTokenUnitsBN(SCDClaimableStr, SCD.decimals);
      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, SCDG.decimals);
      const userSCDGBalance = toTokenUnitsBN(SCDGBalance, SCDG.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, SCDG.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, SCDG.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);
      const lockedUntil = parseInt(lockedUntilStr, 10);

      if (!isCancelled) {
        setTotalBonded(poolTotalBonded);
        setPoolGovAddress(poolAddress);
        setUserSCDGBalance(new BigNumber(userSCDGBalance));
        setUserSCDGAllowance(new BigNumber(SCDGAllowance));
        setUserSCDGBalance(new BigNumber(userSCDGBalance));
        setTotalSCDGSupply(new BigNumber(totalSCDGSupply));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserRewardedSCD(new BigNumber(SCDRewarded));
        setUserClaimableSCD(new BigNumber(SCDClaimable));
        setUserStatus(userStatus);
        setUserStatusUnlocked(Math.max(fluidUntil, lockedUntil));
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

  return (
    <Layout>
      <Guide
        bodyInstructions={
          <p>
            Step 1. Earn SCDG by bonding SCD when TWAP is &lt; 1
            <br />
            Step 2. Stage your SCDG into the Governance Pool
            <br />
            Step 3. Bond your SCDG into the Governance Pool
            <br />
            &nbsp;&nbsp; Note: If you'd like to submit a proposal your SCDG needs
            to remain bonded
          </p>
        }
      />

      <IconHeader
        icon={<i className='fas fa-university' />}
        text='SCDG Rewards'
      />

      <AccountPageHeader
        accountSCDGBalance={userSCDGBalance}
        totalBonded={totalBonded}
        accountStagedBalance={userStagedBalance}
        accountBondedBalance={userBondedBalance}
        accountStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      <WithdrawDeposit
        suffix='SCDG'
        balance={userSCDGBalance}
        allowance={userSCDGAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
        disabled={!user}
        handleApprove={() => {
          approve(SCDG.addr, poolGovAddress);
        }}
        handleDeposit={(depositAmount) => {
          depositPool(
            poolGovAddress,
            toBaseUnitBN(depositAmount, SCDG.decimals),
            () => {}
          );
        }}
        handleWithdraw={(withdrawAmount) => {
          withdrawPool(
            poolGovAddress,
            toBaseUnitBN(withdrawAmount, SCDG.decimals),
            () => {}
          );
        }}
      />

      <BondUnbond
        suffix='SCDG'
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
        disabled={!user}
        handleBond={(bondAmount) => {
          bondPool(
            poolGovAddress,
            toBaseUnitBN(bondAmount, SCDG.decimals),
            () => {}
          );
        }}
        handleUnbond={(unbondAmount) => {
          unbondPool(
            poolGovAddress,
            toBaseUnitBN(unbondAmount, SCDG.decimals),
            () => {}
          );
        }}
      />

      <Claim
        userStatus={userStatus}
        poolAddress={poolGovAddress}
        amountSCD={userClaimableSCD}
      />

      <Rewards poolAddress={poolGovAddress} amountSCD={userRewardedSCD} />
    </Layout>
  );
}

export default PoolGov;
