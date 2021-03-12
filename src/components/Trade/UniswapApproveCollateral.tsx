import React from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { approve } from '../../utils/web3';

import {QSD, BUSD} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import {UniswapV2Router02} from "../../constants/contracts";

type UniswapApproveCollateralProps = {
  user: string,
  userAllowanceQSD: BigNumber
  userAllowanceBUSD: BigNumber
};

function UniswapApproveCollateral({
  user, userAllowanceQSD, userAllowanceBUSD,
}: UniswapApproveCollateralProps) {
  return (
    <Box heading="Unlock for Uniswap">
      <div style={{display: 'flex'}}>
        <div style={{width: '40%'}} />
        {/* Approve Uniswap Router to spend QSD */}
        <div style={{width: '27%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label="Unlock QSD"
            onClick={() => {
              approve(QSD.addr, UniswapV2Router02);
            }}
            disabled={user === '' || userAllowanceQSD.comparedTo(MAX_UINT256) === 0}
          />
        </div>
        {/* Approve Uniswap Router to spend BUSD */}
        <div style={{width: '6%'}} />
        <div style={{width: '27%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label="Unlock BUSD"
            onClick={() => {
              approve(BUSD.addr, UniswapV2Router02);
            }}
            disabled={user === '' || userAllowanceBUSD.comparedTo(MAX_UINT256.dividedBy(2)) > 0}
          />
        </div>
      </div>
    </Box>
  );
}

export default UniswapApproveCollateral;