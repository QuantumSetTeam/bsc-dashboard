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
              On DATE (Ethereum block # BLOCK), we took a snapshot of every wallet that had QSD/QSG on the Ethereum network. <br/> <br/>
              This included all QSD/QSG tokens that were staged/bonded in any contracts (including QSD as part of QSD:DAI LP). <br/> <br/>
              We then minted the corresponding amount of QSD and QSG on the BSC network. <br/> <br/>
              You can claim your QSD/QSG on Binance Smart Chain by following the instructions below. <br/>
            </p>
            <hr style={{color:'white'}} />
            <b><u>Step 1:</u></b> Connect your browser wallet to Binance Smart Chain.<a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank" rel="noopener noreferrer">  <u>Click here for instructions on how to connect.</u></a>
            <br />
            <br />
            <b><u>Step 2:</u></b> Send BNB to your Wallet to pay for gas fees. You can send directly from www.binance.com or by using Binance Bridge<a href="https://www.binance.org/en/bridge" target="_blank" rel="noopener noreferrer">  <u>https://www.binance.org/en/bridge</u></a>
            <br />
            <br />
            <b><u>Step 3:</u></b> Click the “Claim all QSD + QSG” button below to receive your QSD/QSD on Binance Smart Chain.
            <br />
            <br />
              <p>
              Note: In order to retrieve your funds you must use the same wallet address on the BSC network that you used on the ETH network. 
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
