import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {mintTestnetBUSD} from '../../utils/web3';

import { BalanceBlock } from '../common/index';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {BUSD} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type MintBUSDProps = {
  user: string,
  userBalanceBUSD: BigNumber,
}


function MintBUSD({
  user, userBalanceBUSD
}: MintBUSDProps) {
  const [mintAmount, setMintAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Mint">
      <div style={{ display: 'flex' }}>
        {/* BUSD balance */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="BUSD Balance" balance={userBalanceBUSD} />
        </div>
        {/* Mint */}
        <div style={{ width: '38%'}} />
        <div style={{ width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BigNumberInput
                adornment="BUSD"
                value={mintAmount}
                setter={setMintAmount}
              />
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Mint"
                onClick={() => {
                  mintTestnetBUSD(toBaseUnitBN(mintAmount, BUSD.decimals));
                }}
                disabled={user === '' || !isPos(mintAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default MintBUSD;
