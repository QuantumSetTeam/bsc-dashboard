import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock } from '../common/index';
import TextBlock from "../common/TextBlock";
import {ownership} from "../../utils/number";

type AccountPageHeaderProps = {
  accountQSGBalance: BigNumber,
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
  accountQSGBalance, totalBonded, accountStagedBalance, accountBondedBalance, accountStatus, unlocked
}: AccountPageHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Balance" balance={accountQSGBalance} suffix={" QSG"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Staged" balance={accountStagedBalance}  suffix={" QSG"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Bonded" balance={accountBondedBalance} suffix={" QSG"} />
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Pool Ownership" balance={ownership(accountBondedBalance, totalBonded)}  suffix={"%"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <TextBlock label="Status" text={status(accountStatus, unlocked)}/>
    </div>
  </div>
);


export default AccountPageHeader;
