import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@aragon/ui';

import BigNumber from 'bignumber.js';
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getEpoch,
  getExpansionAmount,
  getFluidUntil,
  getInstantaneousSCDPrice,
  getLockedUntil,
  getStatusOf,
  getTokenAllowance,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBonded,
} from '../../utils/infura';
import { SCD, SCDS } from '../../constants/tokens';
import { DAO_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import { toTokenUnitsBN, toBaseUnitBN, toFloat } from '../../utils/number';
import {
  approve,
  deposit,
  withdraw,
  bond,
  unbondUnderlying,
} from '../../utils/web3';

import AccountPageHeader from './Header';
import { WithdrawDeposit, BondUnbond, IconHeader, Guide } from '../common';

function Wallet({ user }: { user: string }) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [epoch, setEpoch] = useState<number>(0);
  const [SCDPrice, setSCDPrice] = useState<BigNumber | null>(null);
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [userSCDBalance, setUserSCDBalance] = useState(new BigNumber(0));
  const [userSCDAllowance, setUserSCDAllowance] = useState(new BigNumber(0));
  const [userSCDSBalance, setUserSCDSBalance] = useState(new BigNumber(0));
  const [totalSCDSSupply, setTotalSCDSSupply] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);
  const [expansionAmount, setExpansionAmount] = useState<number | null>(null);

  // Updates APR
  useEffect(() => {
    const updateAPR = async () => {
      const [
        epoch,
        SCDPrice,
        expansionAmount,
        esdsSupply,
        esdsBonded,
      ] = await Promise.all([
        getEpoch(SCDS.addr),
        getInstantaneousSCDPrice(),
        getExpansionAmount(),
        getTokenTotalSupply(SCDS.addr),
        getTotalBonded(SCDS.addr),
      ]);

      const totalSCDSSupply = toTokenUnitsBN(esdsSupply, SCDS.decimals);

      setEpoch(parseInt(epoch, 10));
      setLockup(DAO_EXIT_LOCKUP_EPOCHS);
      setSCDPrice(SCDPrice);
      setExpansionAmount(expansionAmount);
      setTotalSCDSSupply(new BigNumber(totalSCDSSupply));
      setTotalBonded(toTokenUnitsBN(esdsBonded, SCD.decimals));
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
      const [
        esdBalance,
        esdAllowance,
        esdsBalance,
        stagedBalance,
        bondedBalance,
        status,
        fluidUntilStr,
        lockedUntilStr,
      ] = await Promise.all([
        getTokenBalance(SCD.addr, user),
        getTokenAllowance(SCD.addr, user, SCDS.addr),
        getTokenBalance(SCDS.addr, user),
        getBalanceOfStaged(SCDS.addr, user),
        getBalanceBonded(SCDS.addr, user),
        getStatusOf(SCDS.addr, user),

        getFluidUntil(SCDS.addr, user),
        getLockedUntil(SCDS.addr, user),
      ]);

      const userSCDBalance = toTokenUnitsBN(esdBalance, SCD.decimals);
      const userSCDSBalance = toTokenUnitsBN(esdsBalance, SCDS.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, SCDS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, SCDS.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);
      const lockedUntil = parseInt(lockedUntilStr, 10);

      if (!isCancelled) {
        setUserSCDBalance(new BigNumber(userSCDBalance));
        setUserSCDAllowance(new BigNumber(esdAllowance));
        setUserSCDSBalance(new BigNumber(userSCDSBalance));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserStatus(userStatus);
        setUserStatusUnlocked(Math.max(fluidUntil, lockedUntil));
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

  let daoWeeklyYield = '...';
  let daoHourlyYield = '...';
  let daoDailyYield = '...';
  let daoMonthlyYield = '...';

  // Define number formatting
  var options = { minimumFractionDigits: 0,
                maximumFractionDigits: 2 };
  var numberFormat = new Intl.NumberFormat('en-US', options);

  // Calculate DAO APR (4 hrs)
  if (SCDPrice && totalBonded && expansionAmount) {
    if (epoch <= 72) {
      const totalSCD = toFloat(totalBonded);
      const SCDToAdd = expansionAmount / 2;

      const daoYield = (SCDToAdd / totalSCD) * 100;

      daoHourlyYield = numberFormat.format(daoYield / 4) + '%';
      daoDailyYield = numberFormat.format(daoYield * 6) + '%';
      daoWeeklyYield = numberFormat.format(daoYield * 6 * 7) + '%';
      daoMonthlyYield = numberFormat.format(daoYield * 6 * 30) + '%';
    } else {
      daoWeeklyYield = '0%';
      daoHourlyYield = '0%';
      daoDailyYield = '0%';
      daoMonthlyYield = '0%';
    }
  }

  return (
    <Layout>
      <Guide
        aprs={{
          hourly: daoHourlyYield,
          daily: daoDailyYield,
          weekly: daoWeeklyYield,
          monthly: daoMonthlyYield
        }}
        bodyInstructions={
          <p>
              <p style={{ color: 'red' }}>            
              <b><u>WARNING: </u>Bootstrapping period has ended. Please remove any remaining SCD from this section</b></p>

            <br />
            <br />
            Step 1: Stage your SCD
            <br />
            Step 2: Bond your SCD
            <br />
            Step 3: Unbond any amount of rewards you wish to claim
            <br />
            Step 4: Claim rewards after 1 epoch
            <br />
            <br />
            <b>
              Note: Please unbond your SCD during epoch 73. At the beginning of
              epoch 74 withdraw your SCD to your wallet and then stage and bond
              your tokens on the SCD page to continue receiving rewards. (You
              will be unable to bond SCD when TWAP is above peg from Epoch 75
              onwards)
            </b>
          </p>
        }
      />

      <IconHeader
        icon={<i className='fas fa-dot-circle' />}
        text='Bootstrapping Rewards'
      />

      <AccountPageHeader
        accountSCDBalance={userSCDBalance}
        accountSCDSBalance={userSCDSBalance}
        totalSCDSSupply={totalSCDSSupply}
        accountStagedBalance={userStagedBalance}
        accountBondedBalance={userBondedBalance}
        accountStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      {/* <WithdrawDeposit
        user={user}
        balance={userSCDBalance}
        allowance={userSCDAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
      /> */}

      <WithdrawDeposit
        suffix='SCD'
        balance={userSCDBalance}
        allowance={userSCDAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
        disabled={!user}
        handleApprove={() => {
          approve(SCD.addr, SCDS.addr);
        }}
        handleDeposit={(depositAmount) => {
          deposit(SCDS.addr, toBaseUnitBN(depositAmount, SCD.decimals));
        }}
        handleWithdraw={(withdrawAmount) => {
          withdraw(SCDS.addr, toBaseUnitBN(withdrawAmount, SCD.decimals));
        }}
      />

      {/* <BondUnbond
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
      /> */}

      <BondUnbond
        suffix='SCD'
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
        disabled={!user}
        handleBond={(bondAmount) => {
          bond(SCDS.addr, toBaseUnitBN(bondAmount, SCD.decimals));
        }}
        handleUnbond={(unbondAmount) => {
          unbondUnderlying(SCDS.addr, toBaseUnitBN(unbondAmount, SCD.decimals));
        }}
      />
    </Layout>
  );
}

export default Wallet;
