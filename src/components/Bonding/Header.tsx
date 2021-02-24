import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock } from '../common/index';
import TextBlock from "../common/TextBlock";
import {ownership} from "../../utils/number";

type AccountPageHeaderProps = {
  accountQSDBalance: BigNumber,
  accountQSDSBalance: BigNumber,
  totalBonded: BigNumber,
  accountStagedBalance: BigNumber,
  accountBondedBalance: BigNumber,
  accountStatus: number,
  unlocked: number,
};

const STATUS_MAP = ["Unlocked", "Locked", "Locked"];

function status(accountStatus, unlocked) {
  return STATUS_MAP[accountStatus] + (accountStatus === 0 ? "" : " until " + unlocked)
}

const AccountPageHeader = ({
  accountQSDBalance, accountQSDSBalance, totalBonded, accountStagedBalance, accountBondedBalance, accountStatus, unlocked
}: AccountPageHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Balance" balance={accountQSDBalance} suffix={" QSD"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Staged" balance={accountStagedBalance}  suffix={" QSD"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Bonded" balance={accountBondedBalance} suffix={" QSD"} />
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Pool Ownership" balance={ownership(accountQSDSBalance, totalBonded)}  suffix={"%"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <TextBlock label="Status" text={status(accountStatus, unlocked)}/>
    </div>
  </div>
);


export default AccountPageHeader;
