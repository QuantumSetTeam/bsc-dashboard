import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import {
    getPoolBalanceOfBonded,
    getPoolBalanceOfClaimable1,
    getPoolBalanceOfRewarded1,
    getPoolBalanceOfStaged,
    getTokenBalance,
    getTokenTotalSupply,
} from '../../utils/infura';
import { QSD, QSDS, UNI, newPoolBondingAdd } from '../../constants/tokens';
import { toTokenUnitsBN } from '../../utils/number';
// import {getPoolBondingAddress} from "../../utils/pool";
import { formatBN } from '../../utils/number';
//import Web3 from 'web3';

type TotalBalanceProps = {
    user: string;
};

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
            //const poolAddress = Web3.utils.toChecksumAddress(PoolBondingAdd.addr);
            const poolAddress = newPoolBondingAdd.addr;

            const [
                esdBalance,
                pairBalanceQSDStr,
                pairTotalSupplyUNIStr,
                userUNIBalanceStr,
                userPoolBondedBalanceStr,
                userPoolStagedBalanceStr,
                userPoolRewardedBalanceStr,
                userPoolClaimableBalanceStr,
            ] = await Promise.all([
                getTokenBalance(QSD.addr, user),

                getTokenBalance(QSD.addr, UNI.addr),
                getTokenTotalSupply(UNI.addr),
                getTokenBalance(UNI.addr, user),
                getPoolBalanceOfBonded(poolAddress, user),
                getPoolBalanceOfStaged(poolAddress, user),
                getPoolBalanceOfRewarded1(poolAddress, user),
                getPoolBalanceOfClaimable1(poolAddress, user),
            ]);

            const userBalance = toTokenUnitsBN(esdBalance, QSD.decimals);

            const userUNIBalance = toTokenUnitsBN(
                userUNIBalanceStr,
                QSDS.decimals
            );
            const userPoolBondedBalance = toTokenUnitsBN(
                userPoolBondedBalanceStr,
                QSDS.decimals
            );
            const userPoolStagedBalance = toTokenUnitsBN(
                userPoolStagedBalanceStr,
                QSDS.decimals
            );
            const userPoolRewardedBalance = toTokenUnitsBN(
                userPoolRewardedBalanceStr,
                QSDS.decimals
            );
            const userPoolClaimableBalance = toTokenUnitsBN(
                userPoolClaimableBalanceStr,
                QSDS.decimals
            );

            const UNItoQSD = new BigNumber(pairBalanceQSDStr).dividedBy(
                new BigNumber(pairTotalSupplyUNIStr)
            );

            const poolTotalBalance = UNItoQSD.multipliedBy(
                userPoolStagedBalance.plus(userPoolBondedBalance)
            ).plus(userPoolRewardedBalance.plus(userPoolClaimableBalance));
            const circulationBalance = UNItoQSD.multipliedBy(
                userUNIBalance
            ).plus(userBalance);

            const totalBalance = poolTotalBalance.plus(circulationBalance);

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
        <div
            style={{
                fontSize: 14,
                padding: 3,
                fontWeight: 400,
                lineHeight: 1.5,
                fontFamily: 'aragon-ui-monospace, monospace',
                display: 'none',
            }}
        >
            ${formatBN(totalBalance, 2)}
        </div>
    );
}

export default TotalBalance;
