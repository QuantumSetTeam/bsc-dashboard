import Web3 from 'web3';

import BigNumber from 'bignumber.js';
import { Dao, UniswapV2Router02 } from '../constants/contracts';
import { QSD, UNI, DAI, QSDS } from '../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../constants/values';
import { formatBN, toTokenUnitsBN, toFloat } from './number';
import { getPoolLPAddress } from './pool';

const oracleAbi = require('../constants/abi/Oracle.json');
const dollarAbi = require('../constants/abi/Dollar.json');
const daoAbi = require('../constants/abi/Dao.json');
const poolAbi = require('../constants/abi/Pool.json');
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
  const poolContract = new web3.eth.Contract(poolAbi, dao);
  return poolContract.methods.totalClaimable().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalRewarded = async (dao) => {
  const poolContract = new web3.eth.Contract(poolAbi, dao);
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
export const getTotalBonded = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.totalBonded().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalStaged = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.totalStaged().call();
};

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
  const calls = epochs.map((epoch) => getBalanceOfCoupons(dao, account, epoch));
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
      fromBlock: 0,
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
  const increaseP = daoContract.getPastEvents('SupplyIncrease', {
    fromBlock: 0,
  });
  const decreaseP = daoContract.getPastEvents('SupplyDecrease', {
    fromBlock: 0,
  });
  const neutralP = daoContract.getPastEvents('SupplyNeutral', { fromBlock: 0 });

  const [increase, decrease, neutral] = await Promise.all([
    increaseP,
    decreaseP,
    neutralP,
  ]);

  const events = increase
    .map((e) => ({ type: 'INCREASE', data: e.returnValues }))
    .concat(decrease.map((e) => ({ type: 'DECREASE', data: e.returnValues })))
    .concat(neutral.map((e) => ({ type: 'NEUTRAL', data: e.returnValues })));

  return events.sort((a, b) => b.data.epoch - a.data.epoch);
};

// Uniswap Protocol

export const getCost = async (amount) => {
  const exchange = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
  // eslint-disable-next-line no-unused-vars
  const [inputAmount, _] = await exchange.methods
    .getAmountsIn(new BigNumber(amount).toFixed(), [DAI.addr, QSD.addr])
    .call();
  return inputAmount;
};

export const getProceeds = async (amount) => {
  const exchange = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
  // eslint-disable-next-line no-unused-vars
  const [_, outputAmount] = await exchange.methods
    .getAmountsOut(new BigNumber(amount).toFixed(), [QSD.addr, DAI.addr])
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
  if (token0.toLowerCase() === DAI.addr.toLowerCase()) {
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
  if (token0.toLowerCase() === DAI.addr.toLowerCase()) {
    return {
      dai: token0Balance,
      qsd: token1Balance,
    };
  }
  return {
    dai: token1Balance,
    qsd: token0Balance,
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

  if (token0.toLowerCase() === DAI.addr.toLowerCase()) {
    return {
      dai: token0Balance * ratio,
      qsd: token1Balance * ratio,
    };
  }
  return {
    dai: token1Balance * ratio,
    qsd: token0Balance * ratio,
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

  if (token0.toLowerCase() === DAI.addr.toLowerCase()) {
    return {
      dai: token0Balance * ratio,
      qsd: token1Balance * ratio,
    };
  }
  return {
    dai: token1Balance * ratio,
    qsd: token0Balance * ratio,
  };
};

export const getUserLPStaged = async (user) => {
  const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
  const uniTotalSupplyStr = await getTokenTotalSupply(UNI.addr);
  const uniBondedSupplyStr = await getPoolBalanceOfStaged(
    await getPoolLPAddress(),
    user
  );

  const token0Balance = toFloat(toTokenUnitsBN(reserve.reserve0, 18));
  const token1Balance = toFloat(toTokenUnitsBN(reserve.reserve1, 18));

  const ratio =
    toFloat(toTokenUnitsBN(uniBondedSupplyStr, 18)) /
    toFloat(toTokenUnitsBN(uniTotalSupplyStr, 18));

  if (token0.toLowerCase() === DAI.addr.toLowerCase()) {
    return {
      dai: token0Balance * ratio,
      qsd: token1Balance * ratio,
    };
  }
  return {
    dai: token1Balance * ratio,
    qsd: token0Balance * ratio,
  };
};

export const getLPStagedLiquidity = async () => {
  const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
  const uniTotalSupplyStr = await getTokenTotalSupply(UNI.addr);
  const uniBondedSupplyStr = await getPoolTotalStaged(await getPoolLPAddress());

  const token0Balance = toFloat(toTokenUnitsBN(reserve.reserve0, 18));
  const token1Balance = toFloat(toTokenUnitsBN(reserve.reserve1, 18));

  const ratio =
    toFloat(toTokenUnitsBN(uniBondedSupplyStr, 18)) /
    toFloat(toTokenUnitsBN(uniTotalSupplyStr, 18));

  if (token0.toLowerCase() === DAI.addr.toLowerCase()) {
    return {
      dai: token0Balance * ratio,
      qsd: token1Balance * ratio,
    };
  }
  return {
    dai: token1Balance * ratio,
    qsd: token0Balance * ratio,
  };
};

export const getLPBondedLiquidity = async () => {
  const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
  const uniTotalSupplyStr = await getTokenTotalSupply(UNI.addr);
  const uniBondedSupplyStr = await getPoolTotalBonded(await getPoolLPAddress());

  const token0Balance = toFloat(toTokenUnitsBN(reserve.reserve0, 18));
  const token1Balance = toFloat(toTokenUnitsBN(reserve.reserve1, 18));

  const ratio =
    toFloat(toTokenUnitsBN(uniBondedSupplyStr, 18)) /
    toFloat(toTokenUnitsBN(uniTotalSupplyStr, 18));

  if (token0.toLowerCase() === DAI.addr.toLowerCase()) {
    return {
      dai: token0Balance * ratio,
      qsd: token1Balance * ratio,
    };
  }
  return {
    dai: token1Balance * ratio,
    qsd: token0Balance * ratio,
  };
};

export const getToken0 = async () => {
  const exchange = new web3.eth.Contract(uniswapPairAbi, UNI.addr);
  return exchange.methods.token0().call();
};

// Pool

export const getPoolStatusOf = async (pool, account) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
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
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfBonded(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfStaged = async (pool, account) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
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
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfRewarded(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable = async (pool, account) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfClaimable(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalBonded = async (pool) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.totalBonded().call();
};

export const getPoolTotalStaged = async (pool) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
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
export const getPoolFluidUntil = async (pool, account) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);

  // no need to look back further than the pool lockup period
  const blockNumber = await web3.eth.getBlockNumber();
  const fromBlock = blockNumber - (POOL_EXIT_LOCKUP_EPOCHS + 1) * 8640;
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
  const isBootstrapping = await getDaoIsBootstrapping();

  const totalSupplyStr = await getTokenTotalSupply(QSD.addr);
  const totalSupply = toFloat(toTokenUnitsBN(totalSupplyStr, QSD.decimals));

  // 5.4% max supply
  const MAX_SUPPLY_EXPANSION = 0.054;

  if (isBootstrapping) {
    return totalSupply * MAX_SUPPLY_EXPANSION;
  }

  const delta = Math.min(price - 1, MAX_SUPPLY_EXPANSION);
  const newSupply = totalSupply * delta;

  if (price < 1) {
    return 0;
  }

  return newSupply;
};

export const getTWAPPrice = async () => {
  const daoContract = new web3.eth.Contract(daoAbi, Dao);
  const pairContract = new web3.eth.Contract(uniswapPairAbi, UNI.addr);

  const oracleAddress = await daoContract.methods.oracle().call();
  const oracleContract = new web3.eth.Contract(oracleAbi, oracleAddress);

  // Gets cumulative price

  // eslint-disable-next-line
  const cumulativePriceStr = await oracleContract.methods._cumulative().call();
  // eslint-disable-next-line
  const oracleTimestampStr = await oracleContract.methods._timestamp().call();

  const cumulativePrice = parseFloat(
    formatBN(toTokenUnitsBN(cumulativePriceStr, 18), 2).split(',').join('')
  );
  const oracleTimestamp = parseInt(oracleTimestampStr, 10);

  const token0 = await pairContract.methods.token0().call();

  const resp = await pairContract.methods.getReserves().call();
  const blockTimestampLast = parseInt(resp.blockTimestampLast, 10);
  const price0CumulativeLastStr = await pairContract.methods
    .price0CumulativeLast()
    .call();
  const price1CumulativeLastStr = await pairContract.methods
    .price1CumulativeLast()
    .call();

  const price0Cumulative = parseFloat(
    formatBN(toTokenUnitsBN(price0CumulativeLastStr, 18), 2).split(',').join('')
  );
  const price1Cumulative = parseFloat(
    formatBN(toTokenUnitsBN(price1CumulativeLastStr, 18), 2).split(',').join('')
  );

  const timeDelta = blockTimestampLast - oracleTimestamp;

  const price0 =
    (((price0Cumulative - cumulativePrice) / timeDelta) * 1e18) / 2 ** 112;
  const price1 =
    (((price1Cumulative - cumulativePrice) / timeDelta) * 1e18) / 2 ** 112;

  if (token0.toLowerCase() === QSD.addr.toLowerCase()) {
    return price0;
  }

  return price1;
};
