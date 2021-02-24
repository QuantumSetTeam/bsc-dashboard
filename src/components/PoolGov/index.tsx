/* eslint-disable react-hooks/exhaustive-deps */

import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QSD, QSG } from '../../constants/tokens';
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
  const [userQSGBalance, setUserQSGBalance] = useState(new BigNumber(0));
  const [userQSGAllowance, setUserQSGAllowance] = useState(new BigNumber(0));
  const [totalQSGSupply, setTotalQSGSupply] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);
  const [userRewardedQSD, setUserRewardedQSD] = useState(new BigNumber(0));
  const [userClaimableQSD, setUserClaimableQSD] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setUserQSGBalance(new BigNumber(0));
      setUserQSGAllowance(new BigNumber(0));
      setUserQSGBalance(new BigNumber(0));
      setTotalQSGSupply(new BigNumber(0));
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
        QSGBalance,
        QSGAllowance,
        stagedBalance,
        bondedBalance,
        status,
        fluidUntilStr,
        lockedUntilStr,
        qsdRewardedStr,
        qsdClaimableStr,
      ] = await Promise.all([
        getPoolTotalBonded(poolAddress),
        getTokenBalance(QSG.addr, user),
        getTokenAllowance(QSG.addr, user, poolAddress),
        getBalanceOfStaged(poolAddress, user),
        getBalanceBonded(poolAddress, user),
        getPoolStatusOf(poolAddress, user),
        getPoolFluidUntil(poolAddress, user),
        getLockedUntil(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
      ]);

      const qsdRewarded = toTokenUnitsBN(qsdRewardedStr, QSD.decimals);
      const qsdClaimable = toTokenUnitsBN(qsdClaimableStr, QSD.decimals);
      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, QSG.decimals);
      const userQSGBalance = toTokenUnitsBN(QSGBalance, QSG.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, QSG.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, QSG.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);
      const lockedUntil = parseInt(lockedUntilStr, 10);

      if (!isCancelled) {
        setTotalBonded(poolTotalBonded);
        setPoolGovAddress(poolAddress);
        setUserQSGBalance(new BigNumber(userQSGBalance));
        setUserQSGAllowance(new BigNumber(QSGAllowance));
        setUserQSGBalance(new BigNumber(userQSGBalance));
        setTotalQSGSupply(new BigNumber(totalQSGSupply));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserRewardedQSD(new BigNumber(qsdRewarded));
        setUserClaimableQSD(new BigNumber(qsdClaimable));
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
            Step 1. Earn QSG by bonding QSD when TWAP is &lt; 1
            <br />
            Step 2. Stage your QSG into the Governance Pool
            <br />
            Step 3. Bond your QSG into the Governance Pool
            <br />
            &nbsp;&nbsp; Note: If you'd like to submit a proposal your QSG needs
            to remain bonded
          </p>
        }
      />

      <IconHeader
        icon={<i className='fas fa-university' />}
        text='QSG Rewards'
      />

      <AccountPageHeader
        accountQSGBalance={userQSGBalance}
        totalBonded={totalBonded}
        accountStagedBalance={userStagedBalance}
        accountBondedBalance={userBondedBalance}
        accountStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      <WithdrawDeposit
        suffix='QSG'
        balance={userQSGBalance}
        allowance={userQSGAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
        disabled={!user}
        handleApprove={() => {
          approve(QSG.addr, poolGovAddress);
        }}
        handleDeposit={(depositAmount) => {
          depositPool(
            poolGovAddress,
            toBaseUnitBN(depositAmount, QSG.decimals),
            () => {}
          );
        }}
        handleWithdraw={(withdrawAmount) => {
          withdrawPool(
            poolGovAddress,
            toBaseUnitBN(withdrawAmount, QSG.decimals),
            () => {}
          );
        }}
      />

      <BondUnbond
        suffix='QSG'
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
        disabled={!user}
        handleBond={(bondAmount) => {
          bondPool(
            poolGovAddress,
            toBaseUnitBN(bondAmount, QSG.decimals),
            () => {}
          );
        }}
        handleUnbond={(unbondAmount) => {
          unbondPool(
            poolGovAddress,
            toBaseUnitBN(unbondAmount, QSG.decimals),
            () => {}
          );
        }}
      />

      <Claim
        userStatus={userStatus}
        poolAddress={poolGovAddress}
        amountQSD={userClaimableQSD}
      />

      <Rewards poolAddress={poolGovAddress} amountQSD={userRewardedQSD} />
    </Layout>
  );
}

export default PoolGov;
