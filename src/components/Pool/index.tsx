import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { Layout } from '@aragon/ui';
import { useParams } from 'react-router-dom';
import { DollarPool4 } from '../../constants/contracts';
import { BUSD, QSD, UNI, QSDS } from '../../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import {
    getExpansionAmount,
    getInstantaneousQSDPrice,
    getLPBondedLiquidity,
    getPoolBalanceOfBonded,
    getPoolBalanceOfClaimable,
    getPoolBalanceOfRewarded,
    getPoolBalanceOfStaged,
    getPoolFluidUntil,
    getPoolStatusOf,
    getPoolTotalBonded,
    getTokenAllowance,
    getTokenBalance,
    getEpoch,
} from '../../utils/infura';
import { toBaseUnitBN, toFloat, toTokenUnitsBN } from '../../utils/number';
import { getPoolLPAddress } from '../../utils/pool';
import {
    approve,
    bondPool,
    depositPool,
    unbondPool,
    withdrawPool,
    claimPool,
} from '../../utils/web3';
import {
    BondUnbond,
    IconHeader,
    WithdrawDeposit,
    Claim,
    Guide,
} from '../common';
// import Claim from './Claim';
// import WithdrawDeposit from "./WithdrawDeposit";
// import BondUnbond from './BondUnbond';
import PoolPageHeader from './Header';
import Provide from './Provide';

function Pool({ user }: { user: string }) {
    const { override } = useParams();
    if (override) {
        user = override;
    }

    const [epoch, setEpoch] = useState<number>(0);
    const [QSDLiquidity, setQSDLiquidity] = useState<number | null>(null);
    const [busdLiquidity, setBUSDLiquidity] = useState<number | null>(null);
    const [QSDPrice, setQSDPrice] = useState<BigNumber | null>(null);
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
    const [userRewardedBalance, setUserRewardedBalance] = useState(
        new BigNumber(0)
    );
    const [userClaimableBalance, setUserClaimableBalance] = useState(
        new BigNumber(0)
    );
    const [userStatus, setUserStatus] = useState(0);

    // eslint-disable-next-line
    const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);

    const [lockup, setLockup] = useState(0);

    //APR
    useEffect(() => {
        const updateAPR = async () => {
            const [spot, expansionAmount, liquidity] = await Promise.all([
                getInstantaneousQSDPrice(),
                getExpansionAmount(),
                getLPBondedLiquidity(),
            ]);

            setQSDPrice(toTokenUnitsBN(spot, 18));
            setQSDLiquidity(liquidity.QSD);
            setBUSDLiquidity(liquidity.busd);
            setExpansionAmount(expansionAmount);
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
            setUserRewardedBalance(new BigNumber(0));
            setUserClaimableBalance(new BigNumber(0));
            setUserStatus(0);
            setUserStatusUnlocked(0);
            return;
        }
        let isCancelled = false;

        async function updateUserInfo() {
            const poolAddressStr = await getPoolLPAddress();

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
                rewardedBalance,
                claimableBalance,
                status,
                fluidUntilStr,
                epoch,
            ] = await Promise.all([
                getPoolTotalBonded(poolAddressStr),
                getTokenBalance(QSD.addr, UNI.addr),
                getTokenBalance(BUSD.addr, UNI.addr),
                getTokenBalance(UNI.addr, user),
                getTokenBalance(BUSD.addr, user),

                getTokenAllowance(UNI.addr, user, poolAddressStr),
                getTokenAllowance(BUSD.addr, user, poolAddressStr),
                getPoolBalanceOfStaged(poolAddressStr, user),
                getPoolBalanceOfBonded(poolAddressStr, user),

                getPoolBalanceOfRewarded(poolAddressStr, user),
                getPoolBalanceOfClaimable(poolAddressStr, user),
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
            const userRewardedBalance = toTokenUnitsBN(
                rewardedBalance,
                QSD.decimals
            );
            const userClaimableBalance = toTokenUnitsBN(
                claimableBalance,
                QSD.decimals
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
                setUserRewardedBalance(new BigNumber(userRewardedBalance));
                setUserClaimableBalance(new BigNumber(userClaimableBalance));
                setUserStatus(userStatus);
                setUserStatusUnlocked(fluidUntil);
                setLockup(
                    poolAddressStr === DollarPool4 ? POOL_EXIT_LOCKUP_EPOCHS : 1
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

    let lpHourlyAPR = '...';
    let lpDailyAPR = '...';
    let lpWeeklyAPR = '...';
    let lpMonthlyAPR = '...';

    // Define number formatting
    var options = { minimumFractionDigits: 0, maximumFractionDigits: 2 };
    var numberFormat = new Intl.NumberFormat('en-US', options);

    if (QSDPrice && QSDLiquidity && busdLiquidity && expansionAmount) {
        const totalBUSD = QSDLiquidity * toFloat(QSDPrice) + busdLiquidity;
        const busdToAdd = (expansionAmount / 2) * toFloat(QSDPrice);

        const lpYield = (busdToAdd / totalBUSD) * 100;

        lpHourlyAPR = numberFormat.format(lpYield / 4) + '%';
        lpDailyAPR = numberFormat.format(lpYield * 6) + '%';
        lpWeeklyAPR = numberFormat.format(lpYield * 6 * 7) + '%';
        lpMonthlyAPR = numberFormat.format(lpYield * 6 * 30) + '%';
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
                        Step 4: Wait 1 epoch to claim claimable QSD
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
                accountRewardedQSDBalance={userRewardedBalance}
                accountClaimableQSDBalance={userClaimableBalance}
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

            <Claim
                suffix='QSD'
                claimable={userClaimableBalance}
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

            <Provide
                poolAddress={poolAddress}
                user={user}
                rewarded={userRewardedBalance}
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
