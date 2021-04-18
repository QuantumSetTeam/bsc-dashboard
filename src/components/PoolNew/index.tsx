import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { Layout } from '@aragon/ui';
import { useParams } from 'react-router-dom';
import { BUSD, QSD, UNI, QSDS, newPoolLPAdd } from '../../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import {
    getExpansionAmount,
    getPoolBalanceOfBonded,
    getPoolBalanceOfClaimable1,
    getPoolBalanceOfRewarded1,
    getPoolBalanceOfClaimable2,
    getPoolBalanceOfRewarded2,
    getLPPoolBalanceOfStaged,
    getPoolFluidUntil,
    getPoolStatusOf,
    getLPPoolTotalBonded,
    getTokenAllowance,
    getTokenBalance,
    getEpoch,
    getEpochsAtPeg,
    getDailyExpansionApr,
    getDailyPegApr,
} from '../../utils/infura';
import { toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
import {
    approve,
    bondPool,
    depositPool,
    unbondPool,
    withdrawPool,
} from '../../utils/web3';
import { BondUnbond, IconHeader, WithdrawDeposit, Guide } from '../common';
// import Claim from './Claim';
// import WithdrawDeposit from "./WithdrawDeposit";
// import BondUnbond from './BondUnbond';
import PoolPageHeader from './Header';
import Provide from './Provide';
import { Claim } from './ClaimPoolLP';
import { Rewards } from './Rewards';

function Pool({ user }: { user: string }) {
    const { override } = useParams();
    if (override) {
        user = override;
    }

    const [epoch, setEpoch] = useState<number>(0);
    const [expansionAmount, setExpansionAmount] = useState<number | null>(null);

    const [poolAddress, setPoolAddress] = useState('');
    const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
    const [pairBalanceQSD, setPairBalanceQSD] = useState(new BigNumber(0));
    const [pairBalanceBUSD, setPairBalanceBUSD] = useState(new BigNumber(0));
    const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
    const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
    const [userBUSDBalance, setUserBUSDBalance] = useState(new BigNumber(0));
    const [userBUSDAllowance, setUserBUSDAllowance] = useState(
        new BigNumber(0)
    );
    const [userStagedBalance, setUserStagedBalance] = useState(
        new BigNumber(0)
    );
    const [userBondedBalance, setUserBondedBalance] = useState(
        new BigNumber(0)
    );
    const [QSDuserRewardedBalance, setQSDUserRewardedBalance] = useState(
        new BigNumber(0)
    );
    const [QSDuserClaimableBalance, setQSDUserClaimableBalance] = useState(
        new BigNumber(0)
    );
    const [BUSDuserRewardedBalance, setBUSDUserRewardedBalance] = useState(
        new BigNumber(0)
    );
    const [BUSDuserClaimableBalance, setBUSDUserClaimableBalance] = useState(
        new BigNumber(0)
    );
    const [userStatus, setUserStatus] = useState(0);

    // eslint-disable-next-line
    const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);

    const [lockup, setLockup] = useState(0);

    const [epochsAtPeg, setEpochsAtPeg] = useState<null | number>(null);
    const [dailyExpansionAPRs, setDailyExpansionAPRs] = useState<object | null>(
        null
    );
    const [dailyPegAPRs, setDailyPegAPRs] = useState<object | null>(null);

    //APR
    useEffect(() => {
        const updateAPR = async () => {
            const [
                expansionAmount,
                epochsAtPegResult,
                dailyExpansionAPRsResult,
                dailyPegAPRsResult,
            ] = await Promise.all([
                getExpansionAmount(),
                getEpochsAtPeg(),
                getDailyExpansionApr(),
                getDailyPegApr(),
            ]);

            setExpansionAmount(expansionAmount);
            setEpochsAtPeg(epochsAtPegResult);
            setDailyExpansionAPRs(dailyExpansionAPRsResult);
            setDailyPegAPRs(dailyPegAPRsResult);
        };

        updateAPR();
    }, []);

    //Update User balances
    useEffect(() => {
        if (user === '') {
            setPoolAddress('');
            setPoolTotalBonded(new BigNumber(0));
            setPairBalanceQSD(new BigNumber(0));
            setPairBalanceBUSD(new BigNumber(0));
            setUserUNIBalance(new BigNumber(0));
            setUserUNIAllowance(new BigNumber(0));
            setUserBUSDBalance(new BigNumber(0));
            setUserBUSDAllowance(new BigNumber(0));
            setUserStagedBalance(new BigNumber(0));
            setUserBondedBalance(new BigNumber(0));
            setQSDUserRewardedBalance(new BigNumber(0));
            setQSDUserClaimableBalance(new BigNumber(0));
            setBUSDUserRewardedBalance(new BigNumber(0));
            setBUSDUserClaimableBalance(new BigNumber(0));
            setUserStatus(0);
            setUserStatusUnlocked(0);
            return;
        }
        let isCancelled = false;

        async function updateUserInfo() {
            const poolAddressStr = newPoolLPAdd.addr;

            const [
                poolTotalBondedStr,
                pairBalanceQSDStr,
                pairBalanceBUSDStr,
                balance,
                busdBalance,
                allowance,
                usdcAllowance,
                stagedBalance,
                bondedBalance,
                QSDrewardedBalance,
                QSDclaimableBalance,
                BUSDrewardedBalance,
                BUSDclaimableBalance,
                status,
                fluidUntilStr,
                epoch,
            ] = await Promise.all([
                getLPPoolTotalBonded(poolAddressStr),
                getTokenBalance(QSD.addr, UNI.addr),
                getTokenBalance(BUSD.addr, UNI.addr),
                getTokenBalance(UNI.addr, user),
                getTokenBalance(BUSD.addr, user),

                getTokenAllowance(UNI.addr, user, poolAddressStr),
                getTokenAllowance(BUSD.addr, user, poolAddressStr),
                getLPPoolBalanceOfStaged(poolAddressStr, user),
                getPoolBalanceOfBonded(poolAddressStr, user),

                getPoolBalanceOfRewarded1(poolAddressStr, user),
                getPoolBalanceOfClaimable1(poolAddressStr, user),
                getPoolBalanceOfRewarded2(poolAddressStr, user),
                getPoolBalanceOfClaimable2(poolAddressStr, user),
                getPoolStatusOf(poolAddressStr, user),
                getPoolFluidUntil(poolAddressStr, user),
                getEpoch(QSDS.addr),
            ]);

            setEpoch(parseInt(epoch, 10));

            const poolTotalBonded = toTokenUnitsBN(
                poolTotalBondedStr,
                QSD.decimals
            );
            const pairQSDBalance = toTokenUnitsBN(
                pairBalanceQSDStr,
                QSD.decimals
            );
            const pairBUSDBalance = toTokenUnitsBN(
                pairBalanceBUSDStr,
                BUSD.decimals
            );
            const userUNIBalance = toTokenUnitsBN(balance, UNI.decimals);
            const userBUSDBalance = toTokenUnitsBN(busdBalance, BUSD.decimals);
            const userStagedBalance = toTokenUnitsBN(
                stagedBalance,
                UNI.decimals
            );
            const userBondedBalance = toTokenUnitsBN(
                bondedBalance,
                UNI.decimals
            );
            const QSDuserRewardedBalance = toTokenUnitsBN(
                QSDrewardedBalance,
                QSD.decimals
            );
            const QSDuserClaimableBalance = toTokenUnitsBN(
                QSDclaimableBalance,
                QSD.decimals
            );
            const BUSDuserRewardedBalance = toTokenUnitsBN(
                BUSDrewardedBalance,
                BUSD.decimals
            );
            const BUSDuserClaimableBalance = toTokenUnitsBN(
                BUSDclaimableBalance,
                BUSD.decimals
            );
            const userStatus = parseInt(status, 10);
            const fluidUntil = parseInt(fluidUntilStr, 10);

            if (!isCancelled) {
                setPoolAddress(poolAddressStr);
                setPoolTotalBonded(new BigNumber(poolTotalBonded));
                setPairBalanceQSD(new BigNumber(pairQSDBalance));
                setPairBalanceBUSD(new BigNumber(pairBUSDBalance));
                setUserUNIBalance(new BigNumber(userUNIBalance));
                setUserUNIAllowance(new BigNumber(allowance));
                setUserBUSDAllowance(new BigNumber(usdcAllowance));
                setUserBUSDBalance(new BigNumber(userBUSDBalance));
                setUserStagedBalance(new BigNumber(userStagedBalance));
                setUserBondedBalance(new BigNumber(userBondedBalance));
                setQSDUserRewardedBalance(
                    new BigNumber(QSDuserRewardedBalance)
                );
                setQSDUserClaimableBalance(
                    new BigNumber(QSDuserClaimableBalance)
                );
                setBUSDUserRewardedBalance(
                    new BigNumber(BUSDuserRewardedBalance)
                );
                setBUSDUserClaimableBalance(
                    new BigNumber(BUSDuserClaimableBalance)
                );
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

    let lpHourlyAPR = '...';
    let lpDailyAPR = '...';
    let lpWeeklyAPR = '...';
    let lpMonthlyAPR = '...';

    // Set APR strings
    if (dailyExpansionAPRs && dailyPegAPRs) {
        // APR when in expansion
        if (
            expansionAmount &&
            expansionAmount > 0 &&
            epochsAtPeg &&
            Number(epochsAtPeg) === 0
        ) {
            lpWeeklyAPR = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyExpansionAPRs['poolLPDailyAPR'] * 7);
            lpHourlyAPR = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyExpansionAPRs['poolLPDailyAPR'] / 24);
            lpDailyAPR = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyExpansionAPRs['poolLPDailyAPR']);
            lpMonthlyAPR = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyExpansionAPRs['poolLPDailyAPR'] * 30);

            // APR when at peg
        } else if (epochsAtPeg && epochsAtPeg > 0) {
            lpWeeklyAPR = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyPegAPRs['poolLPDailyAPR'] * 7);
            lpHourlyAPR = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyPegAPRs['poolLPDailyAPR'] / 24);
            lpDailyAPR = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyPegAPRs['poolLPDailyAPR']);
            lpMonthlyAPR = Intl.NumberFormat('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            }).format(dailyPegAPRs['poolLPDailyAPR'] * 30);
        } else if (epochsAtPeg && Number(epochsAtPeg) === 0) {
            lpWeeklyAPR = '0';
            lpHourlyAPR = '0';
            lpDailyAPR = '0';
            lpMonthlyAPR = '0';
        }
    }

    return (
        <Layout>
            <Guide
                aprs={{
                    hourly: lpHourlyAPR,
                    daily: lpDailyAPR,
                    weekly: lpWeeklyAPR,
                    monthly: lpMonthlyAPR,
                }}
                bodyInstructions={
                    <p>
                        Step 1: Stage your CAKE-LP
                        <br />
                        Step 2: Bond your CAKE-LP
                        <br />
                        Step 3: Unbond your CAKE-LP to move rewards to claimable
                        <br />
                        &nbsp;&nbsp; (Remember to re-bond your CAKE-LP to
                        continue getting rewards)
                        <br />
                        Step 4: Wait 1 epoch to claim claimable QSD and BUSD
                        <br />
                        Step 5: Provide your rewards to compound your returns
                        <br />
                        &nbsp;&nbsp; 5.1: Dual Supply - Match your rewards with
                        BUSD from your wallet and add to LP
                        <br />
                        &nbsp;&nbsp; 5.2: Single Sided Supply - Add your rewards
                        directly to your LP
                    </p>
                }
            />

            <IconHeader
                icon={<i className='fas fa-parachute-box' />}
                text='LP Rewards'
            />

            <PoolPageHeader
                accountUNIBalance={userUNIBalance}
                accountBondedBalance={userBondedBalance}
                accountRewardedQSDBalance={QSDuserRewardedBalance}
                accountClaimableQSDBalance={QSDuserClaimableBalance}
                accountRewardedBUSDBalance={BUSDuserRewardedBalance}
                accountClaimableBUSDBalance={BUSDuserClaimableBalance}
                poolTotalBonded={poolTotalBonded}
                accountPoolStatus={userStatus}
                unlocked={epoch + 1}
            />

            {/* <WithdrawDeposit
        poolAddress={poolAddress}
        user={user}
        balance={userUNIBalance}
        allowance={userUNIAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
      /> */}

            <WithdrawDeposit
                suffix='CAKE-LP'
                balance={userUNIBalance}
                allowance={userUNIAllowance}
                stagedBalance={userStagedBalance}
                status={userStatus}
                disabled={!poolAddress}
                handleApprove={() => {
                    approve(UNI.addr, poolAddress);
                }}
                handleDeposit={(depositAmount, callback) => {
                    depositPool(
                        poolAddress,
                        toBaseUnitBN(depositAmount, UNI.decimals),
                        callback
                    );
                }}
                handleWithdraw={(withdrawAmount, callback) => {
                    withdrawPool(
                        poolAddress,
                        toBaseUnitBN(withdrawAmount, UNI.decimals),
                        callback
                    );
                }}
            />

            {/* <BondUnbond
        poolAddress={poolAddress}
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
      /> */}

            <BondUnbond
                suffix='CAKE-LP'
                staged={userStagedBalance}
                bonded={userBondedBalance}
                status={userStatus}
                lockup={lockup}
                disabled={!poolAddress}
                handleBond={(bondAmount, callback) => {
                    bondPool(
                        poolAddress,
                        toBaseUnitBN(bondAmount, UNI.decimals),
                        callback
                    );
                }}
                handleUnbond={(unbondAmount, callback) => {
                    unbondPool(
                        poolAddress,
                        toBaseUnitBN(unbondAmount, UNI.decimals),
                        callback
                    );
                }}
            />

            {/* <Claim
        poolAddress={poolAddress}
        claimable={userClaimableBalance}
        status={userStatus}
      /> */}
            <Rewards
                poolAddress={poolAddress}
                amountQSD={QSDuserRewardedBalance}
                amountBUSD={BUSDuserRewardedBalance}
            />

            <Claim
                userStatus={userStatus}
                poolAddress={newPoolLPAdd.addr}
                amountQSD={QSDuserClaimableBalance}
                amountBUSD={BUSDuserClaimableBalance}
            />
            {/* <Claim
                suffix='QSD'
                claimable={QSDuserClaimableBalance}
                status={userStatus}
                disabled={!poolAddress}
                handleClaim={(claimAmount, callback) => {
                    claimPool(
                        poolAddress,
                        toBaseUnitBN(claimAmount, QSD.decimals),
                        callback
                    );
                }}
            />
            <Claim
                suffix='BUSD'
                claimable={BUSDuserClaimableBalance}
                status={userStatus}
                disabled={!poolAddress}
                handleClaim={(claimAmount, callback) => {
                    claimPool(
                        poolAddress,
                        toBaseUnitBN(claimAmount, BUSD.decimals),
                        callback
                    );
                }}
            /> */}

            <Provide
                poolAddress={poolAddress}
                user={user}
                rewarded={QSDuserRewardedBalance}
                status={userStatus}
                pairBalanceQSD={pairBalanceQSD}
                pairBalanceBUSD={pairBalanceBUSD}
                userBUSDBalance={userBUSDBalance}
                userBUSDAllowance={userBUSDAllowance}
            />
        </Layout>
    );
}

export default Pool;
