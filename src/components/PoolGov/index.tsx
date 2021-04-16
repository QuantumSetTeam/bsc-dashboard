/* eslint-disable react-hooks/exhaustive-deps */

import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QSD, QSG, QSDS, PoolGovAdd } from '../../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import { Layout } from '@aragon/ui';
import {
    getBalanceBonded,
    getBalanceOfStaged,
    getPoolStatusOf,
    getPoolTotalBonded,
    getTokenAllowance,
    getTokenBalance,
    getPoolBalanceOfRewarded,
    getPoolBalanceOfClaimable,
    getEpoch,
} from '../../utils/infura';
import { toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
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
import Web3 from 'web3';

function PoolGov({ user }: { user: string }) {
    const { override } = useParams();
    if (override) {
        user = override;
    }

    const [epoch, setEpoch] = useState<number>(0);
    const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
    const [poolAddress, setPoolAddress] = useState('');
    const [userQSGBalance, setUserQSGBalance] = useState(new BigNumber(0));
    const [userQSGAllowance, setUserQSGAllowance] = useState(new BigNumber(0));
    const [totalQSGSupply, setTotalQSGSupply] = useState(new BigNumber(0));
    const [userStagedBalance, setUserStagedBalance] = useState(
        new BigNumber(0)
    );
    const [userBondedBalance, setUserBondedBalance] = useState(
        new BigNumber(0)
    );
    const [userStatus, setUserStatus] = useState(0);
    // eslint-disable-next-line
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
            const poolAddressStr = Web3.utils.toChecksumAddress(
                PoolGovAdd.addr
            );

            const [
                poolTotalBondedStr,
                QSGBalance,
                QSGAllowance,
                stagedBalance,
                bondedBalance,
                status,
                QSDRewardedStr,
                QSDClaimableStr,
                epoch,
            ] = await Promise.all([
                getPoolTotalBonded(poolAddressStr),
                getTokenBalance(QSG.addr, user),
                getTokenAllowance(QSG.addr, user, poolAddressStr),
                getBalanceOfStaged(poolAddressStr, user),
                getBalanceBonded(poolAddressStr, user),
                getPoolStatusOf(poolAddressStr, user),
                getPoolBalanceOfRewarded(poolAddressStr, user),
                getPoolBalanceOfClaimable(poolAddressStr, user),
                getEpoch(QSDS.addr),
            ]);

            const QSDRewarded = toTokenUnitsBN(QSDRewardedStr, QSD.decimals);
            const QSDClaimable = toTokenUnitsBN(QSDClaimableStr, QSD.decimals);
            const poolTotalBonded = toTokenUnitsBN(
                poolTotalBondedStr,
                QSG.decimals
            );
            const userQSGBalance = toTokenUnitsBN(QSGBalance, QSG.decimals);
            const userStagedBalance = toTokenUnitsBN(
                stagedBalance,
                QSG.decimals
            );
            const userBondedBalance = toTokenUnitsBN(
                bondedBalance,
                QSG.decimals
            );
            const userStatus = parseInt(status, 10);

            setEpoch(parseInt(epoch, 10));

            if (!isCancelled) {
                setTotalBonded(poolTotalBonded);
                setPoolAddress(poolAddressStr);
                setUserQSGBalance(new BigNumber(userQSGBalance));
                setUserQSGAllowance(new BigNumber(QSGAllowance));
                setUserQSGBalance(new BigNumber(userQSGBalance));
                setTotalQSGSupply(new BigNumber(totalQSGSupply));
                setUserStagedBalance(new BigNumber(userStagedBalance));
                setUserBondedBalance(new BigNumber(userBondedBalance));
                setUserRewardedQSD(new BigNumber(QSDRewarded));
                setUserClaimableQSD(new BigNumber(QSDClaimable));
                setUserStatus(userStatus);
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
                        Step 1. Earn QSG by bonding QSD when TWAP is &lt; 1.02
                        <br />
                        Step 2. Stage your QSG into the Governance Pool
                        <br />
                        Step 3. Bond your QSG into the Governance Pool
                        <br />
                        &nbsp;&nbsp; Note: If you'd like to submit a proposal
                        your QSG needs to remain bonded
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
                unlocked={epoch + 1}
            />

            <WithdrawDeposit
                suffix='QSG'
                balance={userQSGBalance}
                allowance={userQSGAllowance}
                stagedBalance={userStagedBalance}
                status={userStatus}
                disabled={!user}
                handleApprove={() => {
                    approve(QSG.addr, poolAddress);
                }}
                handleDeposit={(depositAmount) => {
                    depositPool(
                        poolAddress,
                        toBaseUnitBN(depositAmount, QSG.decimals),
                        () => {}
                    );
                }}
                handleWithdraw={(withdrawAmount) => {
                    withdrawPool(
                        poolAddress,
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
                        poolAddress,
                        toBaseUnitBN(bondAmount, QSG.decimals),
                        () => {}
                    );
                }}
                handleUnbond={(unbondAmount) => {
                    unbondPool(
                        poolAddress,
                        toBaseUnitBN(unbondAmount, QSG.decimals),
                        () => {}
                    );
                }}
            />

            <Claim
                userStatus={userStatus}
                poolAddress={poolAddress}
                amountQSD={userClaimableQSD}
            />

            <Rewards poolAddress={poolAddress} amountQSD={userRewardedQSD} />
        </Layout>
    );
}

export default PoolGov;
