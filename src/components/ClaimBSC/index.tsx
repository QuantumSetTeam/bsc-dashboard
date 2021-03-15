import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  getPoolBalanceOfBonded,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfStaged,
  getPoolFluidUntil,
  getPoolStatusOf
} from '../../utils/infura';

import { getPoolLPAddress } from '../../utils/pool';


import { ClaimBSCTokens, MigrationInstructions } from '../common';

function ClaimBSC({ user }: { user: string }) {
  const { override } = useParams();
  if (override) {
    user = override;
  }


  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));

  // eslint-disable-next-line
  const [userStatus, setUserStatus] = useState(0);
  // eslint-disable-next-line
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);


  //Update User balances
  useEffect(() => {
    if (user === '') {
      setUserStatus(0);
      setUserStatusUnlocked(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddressStr = await getPoolLPAddress();

      const [

        status,
        fluidUntilStr,
      ] = await Promise.all([
        getPoolBalanceOfStaged(poolAddressStr, user),
        getPoolBalanceOfBonded(poolAddressStr, user),

        getPoolBalanceOfRewarded(poolAddressStr, user),
        getPoolStatusOf(poolAddressStr, user),
        getPoolFluidUntil(poolAddressStr, user),
      ]);


      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);

      if (!isCancelled) {
        setPoolTotalBonded(new BigNumber(poolTotalBonded));
        setUserStatus(userStatus);
        setUserStatusUnlocked(fluidUntil);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  // eslint-disable-next-line
  }, [user]);

  
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
            <a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank" rel="noopener noreferrer">  <u>Click here for instructions on how to connect.</u></a>
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
