import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { DollarPool4 } from '../../constants/contracts';
import { BUSD, QSD, UNI } from '../../constants/tokens';
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
  WithdrawDeposit,
  Claim,
  Guide,
} from '../common';


import AccountPageHeader from './Header';
import { ClaimBSCTokens, IconHeader, MigrationInstructions } from '../common';

function ClaimBSC({ user }: { user: string }) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

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
  const [userBUSDAllowance, setUserBUSDAllowance] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userRewardedBalance, setUserRewardedBalance] = useState(
    new BigNumber(0)
  );
  const [userClaimableBalance, setUserClaimableBalance] = useState(
    new BigNumber(0)
  );
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);


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
      ]);

      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, QSD.decimals);
      const pairQSDBalance = toTokenUnitsBN(pairBalanceQSDStr, QSD.decimals);
      const pairBUSDBalance = toTokenUnitsBN(pairBalanceBUSDStr, BUSD.decimals);
      const userUNIBalance = toTokenUnitsBN(balance, UNI.decimals);
      const userBUSDBalance = toTokenUnitsBN(busdBalance, BUSD.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, UNI.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, UNI.decimals);
      const userRewardedBalance = toTokenUnitsBN(rewardedBalance, QSD.decimals);
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
        setLockup(poolAddressStr === DollarPool4 ? POOL_EXIT_LOCKUP_EPOCHS : 1);
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


  // Define number formatting
  var options = { minimumFractionDigits: 0,
                maximumFractionDigits: 2 };
  var numberFormat = new Intl.NumberFormat('en-US', options);

  return (
    <Layout>
      <MigrationInstructions
        
        bodyInstructions={
          <p>
              <p style={{color: 'red',
                         textAlign: 'center',
                         fontSize: '20px'}}>            
              <b>Quantum Set Dollar has migrated to Binance Smart Chain (BSC). <br/>Follow the 
                instructions below to claim your QSD/QSG on the BSC network.</b></p>

            <br />

            <p>
              On DATE (Ethereum block # BLOCK), we took a snapshot of every wallet that had QSD/QSG on the Ethereum network. <br/>
              This includes tokens that were staked/bonded in QSD contracts, as well as tokens that were simply held in wallets. <br/>
              We've minted the exact same token amounts on the BSC network, and in this page you can claim any QSD/QSG that you had prior to the migration.
            </p>
            <hr style={{color:'white'}} />
            Before starting, make sure that your browser wallet is connected to Binance Smart Chain.  
            <a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank">  <u>Click here for instructions on how to connect.</u></a>
            <br />
            <br />
            <b><u>Step 1:</u></b> Click on the "Claim" button below and submit the transaction
            <br />
            <br />
            <b><u>Step 2:</u></b> You will receive in your wallet the corresponding amounts of QSD and QSG 
            that you had on the Ethereum network, 
            at the time of taking the snapshot.
            <br />
            <br />
              <p>
              Note: you must use the same address that you had on the ETH network in order to receive your funds. 
              </p>
          </p>
        }
      />


      <ClaimBSCTokens
      user={user}
      />

    </Layout>
  );
}

export default ClaimBSC;
