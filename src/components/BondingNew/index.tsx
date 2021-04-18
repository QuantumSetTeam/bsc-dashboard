/* eslint-disable react-hooks/exhaustive-deps */

import { Layout } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    QSD,
    QSDS,
    QSG,
    BUSD,
    newPoolBondingAdd,
} from '../../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import {
    getBalanceBonded,
    getBalanceOfStaged,
    getEpoch,
    getExpansionAmount,
    getPoolBalanceOfClaimable1,
    getPoolBalanceOfClaimable2,
    getPoolBalanceOfClaimable3,
    getPoolBalanceOfRewarded1,
    getPoolBalanceOfRewarded2,
    getPoolBalanceOfRewarded3,
    getPoolFluidUntil,
    getPoolStatusOf,
    getPoolTotalBonded,
    getTokenAllowance,
    getTokenBalance,
    getEpochsAtPeg,
    getDailyExpansionApr,
    getDailyPegApr,
} from '../../utils/infura';
import { toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
// import { getPoolBondingAddress } from '../../utils/pool';
import {
    approve,
    bondPool,
    depositPool,
    unbondPool,
    withdrawPool,
} from '../../utils/web3';
import {
    BondUnbond,
    Guide,
    IconHeader,
    WithdrawDeposit,
    ScrollToTop,
} from '../common';
import { Claim } from './Claim';
import AccountPageHeader from './Header';
import { Rewards } from './Rewards';

function BondingNew({ user }: { user: string }) {
    const { override } = useParams();
    if (override) {
        user = override;
    }

    const [epoch, setEpoch] = useState<number>(0);
    const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
    const [poolBondingAddress, setPoolBondingAddress] = useState<null | string>(
        null
    );
    const [userQSDBalance, setUserQSDBalance] = useState(new BigNumber(0));
    const [userQSDAllowance, setUserQSDAllowance] = useState(new BigNumber(0));
    const [userQSDSBalance, setUserQSDSBalance] = useState(new BigNumber(0));
    const [totalQSDSSupply, setTotalQSDSSupply] = useState(new BigNumber(0));
    const [userStagedBalance, setUserStagedBalance] = useState(
        new BigNumber(0)
    );
    const [userBondedBalance, setUserBondedBalance] = useState(
        new BigNumber(0)
    );
    const [userStatus, setUserStatus] = useState(0);
    // eslint-disable-next-line
    const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
    const [lockup, setLockup] = useState(0);
    const [userRewardedQSD, setUserRewardedQSD] = useState(new BigNumber(0));
    const [userRewardedQSG, setUserRewardedQSG] = useState(new BigNumber(0));
    const [userRewardedBUSD, setUserRewardedBUSD] = useState(new BigNumber(0));
    const [userClaimableQSD, setUserClaimableQSD] = useState(new BigNumber(0));
    const [userClaimableQSG, setUserClaimableQSG] = useState(new BigNumber(0));
    const [userClaimableBUSD, setUserClaimableBUSD] = useState(
        new BigNumber(0)
    );

    const [expansionAmount, setExpansionAmount] = useState<number | null>(null);
    const [epochsAtPeg, setEpochsAtPeg] = useState<null | number>(null);
    const [dailyExpansionAPRs, setDailyExpansionAPRs] = useState<object | null>(
        null
    );
    const [dailyPegAPRs, setDailyPegAPRs] = useState<object | null>(null);

    //APR and stuff
    useEffect(() => {
        const updateAPR = async () => {
            const poolBonding = newPoolBondingAdd.addr;

            const [
                epoch,
                expansionAmount,
                totalBonded,
                epochsAtPegResult,
                dailyExpansionAPRsResult,
                dailyPegAPRsResult,
            ] = await Promise.all([
                getEpoch(QSDS.addr),
                getExpansionAmount(),
                getPoolTotalBonded(poolBonding),
                getEpochsAtPeg(),
                getDailyExpansionApr(),
                getDailyPegApr(),
            ]);

            setEpoch(parseInt(epoch, 10));
            setExpansionAmount(expansionAmount);
            setTotalQSDSSupply(new BigNumber(totalQSDSSupply));
            setTotalBonded(toTokenUnitsBN(totalBonded, QSD.decimals));
            setEpochsAtPeg(epochsAtPegResult);
            setDailyExpansionAPRs(dailyExpansionAPRsResult);
            setDailyPegAPRs(dailyPegAPRsResult);
        };

        updateAPR();
    }, []);

    //Update User balances
    useEffect(() => {
        if (user === '') {
            setUserQSDBalance(new BigNumber(0));
            setUserQSDAllowance(new BigNumber(0));
            setUserQSDSBalance(new BigNumber(0));
            setTotalQSDSSupply(new BigNumber(0));
            setUserStagedBalance(new BigNumber(0));
            setUserBondedBalance(new BigNumber(0));
            setUserStatus(0);
            return;
        }
        let isCancelled = false;

        async function updateUserInfo() {
            const poolAddress = newPoolBondingAdd.addr;

            const [
                poolTotalBondedStr,
                QSDBalance,
                QSDAllowance,
                stagedBalance,
                bondedBalance,
                status,
                fluidUntilStr,
                QSDRewardedStr,
                QSGRewardedStr,
                BUSDRewardedStr,
                QSDClaimableStr,
                QSGClaimableStr,
                BUSDClaimableStr,
            ] = await Promise.all([
                getPoolTotalBonded(poolAddress),
                getTokenBalance(QSD.addr, user),
                getTokenAllowance(QSD.addr, user, poolAddress),
                getBalanceOfStaged(poolAddress, user),
                getBalanceBonded(poolAddress, user),
                getPoolStatusOf(poolAddress, user),
                getPoolFluidUntil(poolAddress, user),
                getPoolBalanceOfRewarded1(poolAddress, user),
                getPoolBalanceOfRewarded2(poolAddress, user),
                getPoolBalanceOfRewarded3(poolAddress, user),
                getPoolBalanceOfClaimable1(poolAddress, user),
                getPoolBalanceOfClaimable2(poolAddress, user),
                getPoolBalanceOfClaimable3(poolAddress, user),
            ]);

            const QSDRewarded = toTokenUnitsBN(QSDRewardedStr, QSD.decimals);
            const QSGRewarded = toTokenUnitsBN(QSGRewardedStr, QSG.decimals);
            const BUSDRewarded = toTokenUnitsBN(BUSDRewardedStr, BUSD.decimals);
            const QSDClaimable = toTokenUnitsBN(QSDClaimableStr, QSD.decimals);
            const QSGClaimable = toTokenUnitsBN(QSGClaimableStr, QSG.decimals);
            const BUSDClaimable = toTokenUnitsBN(
                BUSDClaimableStr,
                BUSD.decimals
            );

            const poolTotalBonded = toTokenUnitsBN(
                poolTotalBondedStr,
                QSD.decimals
            );
            const userQSDBalance = toTokenUnitsBN(QSDBalance, QSD.decimals);
            const userStagedBalance = toTokenUnitsBN(
                stagedBalance,
                QSDS.decimals
            );
            const userBondedBalance = toTokenUnitsBN(
                bondedBalance,
                QSDS.decimals
            );
            const userStatus = parseInt(status, 10);
            const fluidUntil = parseInt(fluidUntilStr, 10);

            if (!isCancelled) {
                setTotalBonded(poolTotalBonded);
                setPoolBondingAddress(poolAddress);
                setUserQSDBalance(new BigNumber(userQSDBalance));
                setUserQSDAllowance(new BigNumber(QSDAllowance));
                setUserQSDSBalance(new BigNumber(userQSDSBalance));
                setTotalQSDSSupply(new BigNumber(totalQSDSSupply));
                setUserStagedBalance(new BigNumber(userStagedBalance));
                setUserBondedBalance(new BigNumber(userBondedBalance));
                setUserRewardedQSD(new BigNumber(QSDRewarded));
                setUserRewardedQSG(new BigNumber(QSGRewarded));
                setUserRewardedBUSD(new BigNumber(BUSDRewarded));
                setUserClaimableQSD(new BigNumber(QSDClaimable));
                setUserClaimableQSG(new BigNumber(QSGClaimable));
                setUserClaimableBUSD(new BigNumber(BUSDClaimable));
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

    // Set APR strings
    if (dailyExpansionAPRs && dailyPegAPRs) {
        // APR when in expansion
        if (
            expansionAmount &&
            expansionAmount > 0 &&
            epochsAtPeg &&
            Number(epochsAtPeg) === 0
        ) {
            bondingWeeklyYield = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyExpansionAPRs['poolBondingDailyAPR'] * 7);
            bondingHourlyYield = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyExpansionAPRs['poolBondingDailyAPR'] / 24);
            bondingDailyYield = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyExpansionAPRs['poolBondingDailyAPR']);
            bondingMonthlyYield = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyExpansionAPRs['poolBondingDailyAPR'] * 30);

            // APR when at peg
        } else if (epochsAtPeg && epochsAtPeg > 0) {
            bondingWeeklyYield = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyPegAPRs['poolBondingDailyAPR'] * 7);
            bondingHourlyYield = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyPegAPRs['poolBondingDailyAPR'] / 24);
            bondingDailyYield = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyPegAPRs['poolBondingDailyAPR']);
            bondingMonthlyYield = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyPegAPRs['poolBondingDailyAPR'] * 30);
        } else if (epochsAtPeg && Number(epochsAtPeg) === 0) {
            bondingWeeklyYield = '0';
            bondingHourlyYield = '0';
            bondingDailyYield = '0';
            bondingMonthlyYield = '0';
        }
    }

    return (
        <Layout>
            <ScrollToTop />
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
                    monthly: bondingMonthlyYield,
                }}
                bodyInstructions={
                    <p>
                        Step 1: Stage your QSD
                        <br />
                        Step 2: Bond your QSD *Note that you can only bond QSD
                        when TWAP is &lt;1.02*
                        <br />
                        &nbsp;&nbsp; 2.1: If TWAP is &lt;0.98, you'll be
                        rewarded <b>QSG</b>
                        <br />
                        &nbsp;&nbsp; 2.2: If TWAP is &gt;0.98 and &lt;1.02,
                        you'll be rewarded <b>QSG and BUSD</b>
                        <br />
                        &nbsp;&nbsp; 2.3: If TWAP is &gt;=1.02, you'll be
                        rewarded <b>QSD</b>
                        <br />
                        Step 3: Poke your rewards to move them to claimable
                        <br />
                        Step 4: Wait 1 epoch to claim claimable QSD, BUSD,
                        and/or QSG
                    </p>
                }
            />

            <IconHeader
                icon={<i className='fas fa-atom' />}
                text='QSD Rewards'
            />

            <AccountPageHeader
                accountQSDBalance={userQSDBalance}
                accountQSDSBalance={userQSDSBalance}
                totalBonded={totalBonded}
                accountStagedBalance={userStagedBalance}
                accountBondedBalance={userBondedBalance}
                accountStatus={userStatus}
                unlocked={epoch + 1}
            />

            <WithdrawDeposit
                suffix='QSD'
                balance={userQSDBalance}
                allowance={userQSDAllowance}
                stagedBalance={userStagedBalance}
                status={userStatus}
                disabled={!user}
                handleApprove={() => {
                    approve(QSD.addr, poolBondingAddress);
                }}
                handleDeposit={(depositAmount) => {
                    depositPool(
                        poolBondingAddress,
                        toBaseUnitBN(depositAmount, QSD.decimals),
                        () => {}
                    );
                }}
                handleWithdraw={(withdrawAmount) => {
                    withdrawPool(
                        poolBondingAddress,
                        toBaseUnitBN(withdrawAmount, QSD.decimals),
                        () => {}
                    );
                }}
            />

            <BondUnbond
                extraTip={'Can only bond when QSD < 1.02 BUSD.'}
                suffix='QSD'
                staged={userStagedBalance}
                bonded={userBondedBalance}
                status={userStatus}
                lockup={lockup}
                disabled={!user}
                handleBond={(bondAmount) => {
                    bondPool(
                        poolBondingAddress,
                        toBaseUnitBN(bondAmount, QSD.decimals),
                        () => {}
                    );
                }}
                handleUnbond={(unbondAmount) => {
                    unbondPool(
                        poolBondingAddress,
                        toBaseUnitBN(unbondAmount, QSD.decimals),
                        () => {}
                    );
                }}
            />

            <Rewards
                poolAddress={poolBondingAddress}
                amountQSD={userRewardedQSD}
                amountQSG={userRewardedQSG}
                amountBUSD={userRewardedBUSD}
            />

            <Claim
                userStatus={userStatus}
                poolAddress={poolBondingAddress}
                amountQSD={userClaimableQSD}
                amountQSG={userClaimableQSG}
                amountBUSD={userClaimableBUSD}
            />
        </Layout>
    );
}

export default BondingNew;
