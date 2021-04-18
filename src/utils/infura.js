import Web3 from 'web3';

import BigNumber from 'bignumber.js';
import { Dao, UniswapV2Router02 } from '../constants/contracts';
import { QSD, UNI, BUSD, QSDS, newPoolBondingAdd } from '../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../constants/values';
import { formatBN, toTokenUnitsBN, toFloat } from './number';
import { getPoolLPAddress } from './pool';

// import { create, all } from 'mathjs';

// const config = {};
// const math = create(all, config);

// const oracleAbi = require('../constants/abi/Oracle.json');
const dollarAbi = require('../constants/abi/Dollar.json');
const daoAbi = require('../constants/abi/Dao.json');
const poolGovAbi = require('../constants/abi/PoolGov.json');
const poolLPAbi = require('../constants/abi/PoolLP.json');
const poolBondingAbi = require('../constants/abi/PoolBonding.json');
const uniswapRouterAbi = require('../constants/abi/UniswapV2Router02.json');
const uniswapPairAbi = require('../constants/abi/UniswapV2Pair.json');

let web3;
// eslint-disable-next-line no-undef
if (window.ethereum !== undefined) {
    // eslint-disable-next-line no-undef
    web3 = new Web3(ethereum);
}

/**
 *
 * @param {string} token address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getTokenBalance = async (token, account) => {
    if (account === '') return '0';
    const tokenContract = new web3.eth.Contract(dollarAbi, token);
    return tokenContract.methods.balanceOf(account).call();
};

export const getTokenTotalSupply = async (token) => {
    const tokenContract = new web3.eth.Contract(dollarAbi, token);
    return tokenContract.methods.totalSupply().call();
};

/**
 *
 * @param {string} token
 * @param {string} account
 * @param {string} spender
 * @return {Promise<string>}
 */
export const getTokenAllowance = async (token, account, spender) => {
    const tokenContract = new web3.eth.Contract(dollarAbi, token);
    return tokenContract.methods.allowance(account, spender).call();
};

// QSD Protocol

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getBalanceBonded = async (dao, account) => {
    if (account === '') return '0';
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.balanceOfBonded(account).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getBalanceOfStaged = async (dao, account) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.balanceOfStaged(account).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getStatusOf = async (dao, account) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.statusOf(account).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getFluidUntil = async (dao, account) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.fluidUntil(account).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLockedUntil = async (dao, account) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.lockedUntil(account).call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpoch = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.epoch().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpochTime = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.epochTime().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalDebt = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.totalDebt().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalClaimable = async (dao) => {
    const poolContract = new web3.eth.Contract(poolGovAbi, dao);
    return poolContract.methods.totalClaimable().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalRewarded = async (dao) => {
    const poolContract = new web3.eth.Contract(poolGovAbi, dao);
    return poolContract.methods.totalRewarded().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalCoupons = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.totalCoupons().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalCouponsUnderlying = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.totalCouponUnderlying().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
// export const getTotalBonded = async (dao) => {
//     const daoContract = new web3.eth.Contract(daoAbi, dao);
//     return daoContract.methods.totalBonded().call();
// };

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
// export const getTotalStaged = async (dao) => {
//     const daoContract = new web3.eth.Contract(daoAbi, dao);
//     return daoContract.methods.totalStaged().call();
// };

/**
 *
 * @param {string} dao address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getTotalBondedAt = async (dao, epoch) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.totalBondedAt(epoch).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getApproveFor = async (dao, candidate) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.approveFor(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getRejectFor = async (dao, candidate) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.rejectFor(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getStartFor = async (dao, candidate) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.startFor(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getPeriodFor = async (dao, candidate) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.periodFor(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<boolean>}
 */
export const getIsInitialized = async (dao, candidate) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.isInitialized(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getRecordedVote = async (dao, account, candidate) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.recordedVote(account, candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getBalanceOfCoupons = async (dao, account, epoch) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.balanceOfCoupons(account, epoch).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number[]} epochs number[]
 * @return {Promise<string[]>}
 */
export const getBatchBalanceOfCoupons = async (dao, account, epochs) => {
    const calls = epochs.map((epoch) =>
        getBalanceOfCoupons(dao, account, epoch)
    );
    return Promise.all(calls);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getBalanceOfCouponsUnderlying = async (dao, account, epoch) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.balanceOfCouponUnderlying(account, epoch).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number[]} epochs number[]
 * @return {Promise<string[]>}
 */
export const getBatchBalanceOfCouponsUnderlying = async (
    dao,
    account,
    epochs
) => {
    const calls = epochs.map((epoch) =>
        getBalanceOfCouponsUnderlying(dao, account, epoch)
    );
    return Promise.all(calls);
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch address
 * @return {Promise<string>}
 */
export const getOutstandingCoupons = async (dao, epoch) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.outstandingCoupons(epoch).call();
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getCouponsExpiration = async (dao, epoch) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.couponsExpiration(epoch).call();
};

/**
 *
 * @param {string} dao address
 * @param {number[]} epochs number[]
 * @return {Promise<string[]>}
 */
export const getBatchCouponsExpiration = async (dao, epochs) => {
    const calls = epochs.map((epoch) => getCouponsExpiration(dao, epoch));
    return Promise.all(calls);
};

/**
 *
 * @param {string} dao address
 * @param {string|BigNumber} amount uint256
 * @return {Promise<string>}
 */
export const getCouponPremium = async (dao, amount) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods
        .couponPremium(new BigNumber(amount).toFixed())
        .call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getImplementation = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.implementation().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getPoolBonding = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.poolBonding().call();
};

export const getPoolLP = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.poolLP().call();
};

export const getPoolGov = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    return daoContract.methods.poolGov().call();
};

/**
 *
 * @param {string} dao
 * @param {string} account
 * @return {Promise<any[]>}
 */
export const getCouponEpochs = async (dao, account) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    const purchaseP = daoContract.getPastEvents('CouponPurchase', {
        filter: { account },
        fromBlock: 0,
    });
    const transferP = daoContract.getPastEvents('CouponTransfer', {
        filter: { to: account },
        fromBlock: 0,
    });
    const [bought, given] = await Promise.all([purchaseP, transferP]);
    const events = bought
        .map((e) => ({
            epoch: e.returnValues.epoch,
            amount: e.returnValues.couponAmount,
        }))
        .concat(given.map((e) => ({ epoch: e.returnValues.epoch, amount: 0 })));

    const couponEpochs = [
        ...events
            .reduce((map, event) => {
                const { epoch, amount } = event;
                const prev = map.get(epoch);

                if (prev) {
                    map.set(epoch, {
                        epoch,
                        coupons: prev.coupons.plus(new BigNumber(amount)),
                    });
                } else {
                    map.set(epoch, { epoch, coupons: new BigNumber(amount) });
                }

                return map;
            }, new Map())
            .values(),
    ];

    return couponEpochs.sort((a, b) => a - b);
};

/**
 *
 * @param {string} dao
 * @return {Promise<any[]>}
 */
export const getAllProposals = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);
    const payload = (
        await daoContract.getPastEvents('Proposal', {
            // Hardcoded values for specific proposal
            fromBlock: 7955500,
            toBlock: 7955570,
        })
    ).map((event) => {
        const prop = event.returnValues;
        prop.blockNumber = event.blockNumber;
        return prop;
    });
    return payload.sort((a, b) => b.blockNumber - a.blockNumber);
};

/**
 *
 * @param {string} dao
 * @return {Promise<any[]>}
 */
export const getAllRegulations = async (dao) => {
    const daoContract = new web3.eth.Contract(daoAbi, dao);

    const blockNumber = await web3.eth.getBlockNumber();
    const fromBlock = blockNumber - 4999;

    const increaseP = daoContract.getPastEvents('SupplyIncrease', {
        fromBlock: fromBlock,
    });
    const decreaseP = daoContract.getPastEvents('SupplyDecrease', {
        fromBlock: fromBlock,
    });
    const neutralP = daoContract.getPastEvents('SupplyNeutral', {
        fromBlock: fromBlock,
    });

    const [increase, decrease, neutral] = await Promise.all([
        increaseP,
        decreaseP,
        neutralP,
    ]);

    const events = increase
        .map((e) => ({ type: 'INCREASE', data: e.returnValues }))
        .concat(
            decrease.map((e) => ({ type: 'DECREASE', data: e.returnValues }))
        )
        .concat(
            neutral.map((e) => ({ type: 'NEUTRAL', data: e.returnValues }))
        );

    return events.sort((a, b) => b.data.epoch - a.data.epoch);
};

// Uniswap Protocol

export const getCost = async (amount) => {
    const exchange = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
    // eslint-disable-next-line no-unused-vars
    const [inputAmount, _] = await exchange.methods
        .getAmountsIn(new BigNumber(amount).toFixed(), [BUSD.addr, QSD.addr])
        .call();
    return inputAmount;
};

export const getProceeds = async (amount) => {
    const exchange = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
    // eslint-disable-next-line no-unused-vars
    const [
        // eslint-disable-next-line no-unused-vars
        _,
        outputAmount,
    ] = await exchange.methods
        .getAmountsOut(new BigNumber(amount).toFixed(), [QSD.addr, BUSD.addr])
        .call();
    return outputAmount;
};

export const getReserves = async () => {
    const exchange = new web3.eth.Contract(uniswapPairAbi, UNI.addr);
    return exchange.methods.getReserves().call();
};

export const getInstantaneousQSDPrice = async () => {
    const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
    const token0Balance = new BigNumber(reserve.reserve0);
    const token1Balance = new BigNumber(reserve.reserve1);
    if (token0.toLowerCase() === BUSD.addr.toLowerCase()) {
        return token0Balance
            .multipliedBy(new BigNumber(10).pow(18))
            .dividedBy(token1Balance);
    }
    return token1Balance
        .multipliedBy(new BigNumber(10).pow(18))
        .dividedBy(token0Balance);
};

export const getUniswapLiquidity = async () => {
    const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
    const token0Balance = new BigNumber(reserve.reserve0);
    const token1Balance = new BigNumber(reserve.reserve1);
    if (token0.toLowerCase() === BUSD.addr.toLowerCase()) {
        return {
            busd: token0Balance,
            QSD: token1Balance,
        };
    }
    return {
        busd: token1Balance,
        QSD: token0Balance,
    };
};

export const getUserLPWallet = async (user) => {
    const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
    const uniTotalSupplyStr = await getTokenTotalSupply(UNI.addr);
    const uniBondedSupplyStr = await getTokenBalance(UNI.addr, user);

    const token0Balance = toFloat(toTokenUnitsBN(reserve.reserve0, 18));
    const token1Balance = toFloat(toTokenUnitsBN(reserve.reserve1, 18));

    const ratio =
        toFloat(toTokenUnitsBN(uniBondedSupplyStr, 18)) /
        toFloat(toTokenUnitsBN(uniTotalSupplyStr, 18));

    if (token0.toLowerCase() === BUSD.addr.toLowerCase()) {
        return {
            busd: token0Balance * ratio,
            QSD: token1Balance * ratio,
        };
    }
    return {
        busd: token1Balance * ratio,
        QSD: token0Balance * ratio,
    };
};

export const getUserLPBonded = async (user) => {
    const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
    const uniTotalSupplyStr = await getTokenTotalSupply(UNI.addr);
    const uniBondedSupplyStr = await getPoolBalanceOfBonded(
        await getPoolLPAddress(),
        user
    );

    const token0Balance = toFloat(toTokenUnitsBN(reserve.reserve0, 18));
    const token1Balance = toFloat(toTokenUnitsBN(reserve.reserve1, 18));

    const ratio =
        toFloat(toTokenUnitsBN(uniBondedSupplyStr, 18)) /
        toFloat(toTokenUnitsBN(uniTotalSupplyStr, 18));

    if (token0.toLowerCase() === BUSD.addr.toLowerCase()) {
        return {
            busd: token0Balance * ratio,
            QSD: token1Balance * ratio,
        };
    }
    return {
        busd: token1Balance * ratio,
        QSD: token0Balance * ratio,
    };
};

export const getUserLPStaged = async (user) => {
    const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
    const uniTotalSupplyStr = await getTokenTotalSupply(UNI.addr);
    const uniBondedSupplyStr = await getLPPoolBalanceOfStaged(
        await getPoolLPAddress(),
        user
    );

    const token0Balance = toFloat(toTokenUnitsBN(reserve.reserve0, 18));
    const token1Balance = toFloat(toTokenUnitsBN(reserve.reserve1, 18));

    const ratio =
        toFloat(toTokenUnitsBN(uniBondedSupplyStr, 18)) /
        toFloat(toTokenUnitsBN(uniTotalSupplyStr, 18));

    if (token0.toLowerCase() === BUSD.addr.toLowerCase()) {
        return {
            busd: token0Balance * ratio,
            QSD: token1Balance * ratio,
        };
    }
    return {
        busd: token1Balance * ratio,
        QSD: token0Balance * ratio,
    };
};

export const getLPStagedLiquidity = async () => {
    const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
    const uniTotalSupplyStr = await getTokenTotalSupply(UNI.addr);
    const uniBondedSupplyStr = await getPoolTotalStaged(
        await getPoolLPAddress()
    );

    const token0Balance = toFloat(toTokenUnitsBN(reserve.reserve0, 18));
    const token1Balance = toFloat(toTokenUnitsBN(reserve.reserve1, 18));

    const ratio =
        toFloat(toTokenUnitsBN(uniBondedSupplyStr, 18)) /
        toFloat(toTokenUnitsBN(uniTotalSupplyStr, 18));

    if (token0.toLowerCase() === BUSD.addr.toLowerCase()) {
        return {
            busd: token0Balance * ratio,
            QSD: token1Balance * ratio,
        };
    }
    return {
        busd: token1Balance * ratio,
        QSD: token0Balance * ratio,
    };
};

export const getLPBondedLiquidity = async () => {
    const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
    const uniTotalSupplyStr = await getTokenTotalSupply(UNI.addr);
    const uniBondedSupplyStr = await getPoolTotalBonded(
        await getPoolLPAddress()
    );

    const token0Balance = toFloat(toTokenUnitsBN(reserve.reserve0, 18));
    const token1Balance = toFloat(toTokenUnitsBN(reserve.reserve1, 18));

    const ratio =
        toFloat(toTokenUnitsBN(uniBondedSupplyStr, 18)) /
        toFloat(toTokenUnitsBN(uniTotalSupplyStr, 18));

    if (token0.toLowerCase() === BUSD.addr.toLowerCase()) {
        return {
            busd: token0Balance * ratio,
            QSD: token1Balance * ratio,
        };
    }
    return {
        busd: token1Balance * ratio,
        QSD: token0Balance * ratio,
    };
};

export const getToken0 = async () => {
    const exchange = new web3.eth.Contract(uniswapPairAbi, UNI.addr);
    return exchange.methods.token0().call();
};

// Pool

export const getPoolStatusOf = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolGovAbi, pool);
    return poolContract.methods.statusOf(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfBonded = async (pool, account) => {
    if (account === '') return '0';
    const poolContract = new web3.eth.Contract(poolGovAbi, pool);
    return poolContract.methods.balanceOfBonded(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfStaged = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolGovAbi, pool);
    return poolContract.methods.balanceOfStaged(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLPPoolBalanceOfStaged = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolLPAbi, pool);
    return poolContract.methods.balanceOfStaged(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfRewarded = async (pool, account) => {
    if (account === '') return '0';
    const poolContract = new web3.eth.Contract(poolGovAbi, pool);
    return poolContract.methods.balanceOfRewarded(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolGovAbi, pool);
    return poolContract.methods.balanceOfClaimable(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalBonded = async (pool) => {
    const poolContract = new web3.eth.Contract(poolGovAbi, pool);
    return poolContract.methods.totalBonded().call();
};

export const getPoolTotalStaged = async (pool) => {
    const poolContract = new web3.eth.Contract(poolGovAbi, pool);
    return poolContract.methods.totalStaged().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLPPoolTotalBonded = async (pool) => {
    const poolContract = new web3.eth.Contract(poolLPAbi, pool);
    return poolContract.methods.totalBonded().call();
};

export const getLPPoolTotalStaged = async (pool) => {
    const poolContract = new web3.eth.Contract(poolLPAbi, pool);
    return poolContract.methods.totalStaged().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalRewarded1 = async (pool) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.totalRewarded1().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalRewarded2 = async (pool) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.totalRewarded2().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalRewarded3 = async (pool) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.totalRewarded3().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLPPoolTotalClaimable1 = async (poolLP) => {
    const poolContract = new web3.eth.Contract(poolLPAbi, poolLP);
    return poolContract.methods.totalClaimable1().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLPPoolTotalClaimable2 = async (poolLP) => {
    const poolContract = new web3.eth.Contract(poolLPAbi, poolLP);
    return poolContract.methods.totalClaimable2().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLPPoolTotalRewarded1 = async (pool) => {
    const poolContract = new web3.eth.Contract(poolLPAbi, pool);
    return poolContract.methods.totalRewarded1().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLPPoolTotalRewarded2 = async (pool) => {
    const poolContract = new web3.eth.Contract(poolLPAbi, pool);
    return poolContract.methods.totalRewarded2().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalClaimable1 = async (pool) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.totalClaimable1().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalClaimable2 = async (pool) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.totalClaimable2().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalClaimable3 = async (pool) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.totalClaimable3().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfRewarded1 = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.balanceOfRewarded1(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfRewarded2 = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.balanceOfRewarded2(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfRewarded3 = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.balanceOfRewarded3(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable1 = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.balanceOfClaimable1(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable2 = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.balanceOfClaimable2(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable3 = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolBondingAbi, pool);
    return poolContract.methods.balanceOfClaimable3(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolFluidUntil = async (pool, account) => {
    const poolContract = new web3.eth.Contract(poolGovAbi, pool);

    // no need to look back further than the pool lockup period
    const blockNumber = await web3.eth.getBlockNumber();
    const fromBlock = blockNumber - (POOL_EXIT_LOCKUP_EPOCHS + 1) * 1000;
    const bondP = poolContract.getPastEvents('Bond', {
        filter: { account: account },
        fromBlock: fromBlock,
    });
    const unbondP = poolContract.getPastEvents('Unbond', {
        filter: { account: account },
        fromBlock: fromBlock,
    });

    const [bond, unbond] = await Promise.all([bondP, unbondP]);
    const events = bond
        .map((e) => e.returnValues)
        .concat(unbond.map((e) => e.returnValues));

    const startEpoch = events.reduce((epoch, event) => {
        if (epoch > event.start) return epoch;
        else return event.start;
    }, 0);

    // these contract events report the start epoch as one more than the active
    // epoch when the event is emitted, so we subtract 1 here to adjust
    return (parseInt(startEpoch, 10) + POOL_EXIT_LOCKUP_EPOCHS - 1).toString();
};

export const getDaoIsBootstrapping = async () => {
    const epoch = await getEpoch(QSDS.addr);
    const daoContract = new web3.eth.Contract(daoAbi, Dao);
    const isBootstrapping = await daoContract.methods
        .bootstrappingAt(epoch)
        .call();

    return isBootstrapping;
};

export const getExpansionAmount = async () => {
    const price = await getTWAPPrice();

    const totalSupplyStr = await getTokenTotalSupply(QSD.addr);
    const totalSupply = toFloat(toTokenUnitsBN(totalSupplyStr, QSD.decimals));

    // 5.4% max supply
    const MAX_SUPPLY_EXPANSION = 0.054;

    const delta = Math.min((price - 1.02) * 0.1, MAX_SUPPLY_EXPANSION);
    const newSupply = totalSupply * delta;

    if (price < 1.02) {
        return 0;
    }

    return newSupply;
};

export const getTWAPPrice = async () => {
    const daoContract = new web3.eth.Contract(daoAbi, Dao);

    const priceStr = await daoContract.methods.getEpochTwap().call();

    const price = parseFloat(
        formatBN(toTokenUnitsBN(priceStr, 18), 2).split(',').join('')
    );

    return price;
};

export const getExpansionState = async () => {
    const daoContract = new web3.eth.Contract(daoAbi, Dao);

    const expansionState = await daoContract.methods.epochInExpansion().call();

    return expansionState;
};

export const getEpochsAtPeg = async () => {
    const daoContract = new web3.eth.Contract(daoAbi, Dao);

    const epochsAtPeg = await daoContract.methods.epochsAtPeg().call();

    return epochsAtPeg;
};

export const getDaoBusdBalance = async () => {
    const busdContract = new web3.eth.Contract(dollarAbi, BUSD.addr);

    const balance = await busdContract.methods.balanceOf(Dao).call();

    const balanceFormatted = toFloat(toTokenUnitsBN(balance, 18));

    return balanceFormatted;
};

export const getPoolBondingBondedInUSD = async () => {
    const QSDPriceStr = await getInstantaneousQSDPrice();

    const QSDPrice = toFloat(toTokenUnitsBN(QSDPriceStr, 18));

    const poolBondingTotalBondedStr = await getPoolTotalBonded(
        newPoolBondingAdd.addr
    );

    const poolBondingTotalBonded =
        toFloat(toTokenUnitsBN(poolBondingTotalBondedStr, 18)) * QSDPrice;

    return poolBondingTotalBonded;
};

export const getPoolLPBondedInUSD = async () => {
    const QSDPriceStr = await getInstantaneousQSDPrice();

    const QSDPrice = toFloat(toTokenUnitsBN(QSDPriceStr, 18));

    const liquidityAmounts = await getLPBondedLiquidity();

    const totalBonded =
        liquidityAmounts['busd'] + liquidityAmounts['QSD'] * QSDPrice;

    return totalBonded;
};

export const getDailyPegApr = async () => {
    const busdBalance = await getDaoBusdBalance();

    const epochsAtPeg = await getEpochsAtPeg();

    // If we're not at peg, just return 0
    if (Number(epochsAtPeg) === 0) {
        return {
            poolBondingDailyAPR: 0,
            poolLPDailyAPR: 0,
        };
    }

    // balance * [((epochsatpeg - 1) ** 1.25) * (0.75.div(100)) + (4.div(100))]
    const baseReturn =
        ((epochsAtPeg - 1) ** 1.25 * (0.75 / 100) + 4 / 100) * busdBalance;

    const poolBondingBonded = await getPoolBondingBondedInUSD();

    const poolLPBonded = await getPoolLPBondedInUSD();

    // 50% of the BUSD returns go to this pool, the other 50%
    // go to the poolLP pool
    const poolBondingAPRPerEpoch = ((baseReturn / 2) * 100) / poolBondingBonded;
    const poolBondingAPRPerDay = poolBondingAPRPerEpoch * 4;

    const poolLPAPRPerEpoch = ((baseReturn / 2) * 100) / poolLPBonded;
    const poolLPAPRPerDay = poolLPAPRPerEpoch * 4;

    return {
        poolBondingDailyAPR: poolBondingAPRPerDay,
        poolLPDailyAPR: poolLPAPRPerDay,
    };
};

export const getDailyExpansionApr = async () => {
    const poolBondingBonded = await getPoolBondingBondedInUSD();

    const poolLPBonded = await getPoolLPBondedInUSD();

    const expansionAmount = await getExpansionAmount();

    // 25% is written off to buy BUSD for peg rewards
    const expansionToDistribute = expansionAmount * 0.75;

    const expansionForPoolBonding = expansionToDistribute * 0.4;
    const expansionForPoolLP = expansionToDistribute * 0.35;

    const poolBondingAPRPerEpoch =
        (expansionForPoolBonding * 100) / poolBondingBonded;
    const poolBondingAPRPerDay = poolBondingAPRPerEpoch * 6;

    const poolLPAPRPerEpoch = (expansionForPoolLP * 100) / poolLPBonded;
    const poolLPAPRPerDay = poolLPAPRPerEpoch * 6;

    return {
        poolBondingDailyAPR: poolBondingAPRPerDay,
        poolLPDailyAPR: poolLPAPRPerDay,
    };
};
