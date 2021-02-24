import {
  Button,
  Header,
  IconCircleMinus,
  IconCirclePlus,
  IconLock,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { QSD, QSDS } from '../../constants/tokens';
import { MAX_UINT256 } from '../../constants/values';
import { isPos, toBaseUnitBN } from '../../utils/number';
import { approve, deposit, withdraw } from '../../utils/web3';
import BigNumberInput from '../common/BigNumberInput';
import {
  BalanceBlock,
  MaxButton,
  Section,
  TopBorderBox,
} from '../common/index';

type WithdrawDepositProps = {
  user: string;
  balance: BigNumber;
  allowance: BigNumber;
  stagedBalance: BigNumber;
  status: number;
};

function WithdrawDeposit({
  user,
  balance,
  allowance,
  stagedBalance,
  status,
}: WithdrawDepositProps) {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  return (
    <Section>
      <Header primary='Stage' />
      <TopBorderBox>
        {allowance.comparedTo(MAX_UINT256) === 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* total Issued */}
            <div style={{ flexBasis: '32%' }}>
              <BalanceBlock
                asset='Staged'
                balance={stagedBalance}
                suffix={'QSD'}
              />
            </div>
            {/* Deposit QSD into DAO */}
            <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '60%', minWidth: '6em' }}>
                  <>
                    <BigNumberInput
                      adornment='QSD'
                      value={depositAmount}
                      setter={setDepositAmount}
                      disabled={status !== 0}
                    />
                    <MaxButton
                      onClick={() => {
                        setDepositAmount(balance);
                      }}
                    />
                  </>
                </div>
                <div style={{ width: '40%', minWidth: '6em' }}>
                  <Button
                    wide
                    icon={status === 0 ? <IconCirclePlus /> : <IconLock />}
                    label='Deposit'
                    onClick={() => {
                      deposit(
                        QSDS.addr,
                        toBaseUnitBN(depositAmount, QSD.decimals)
                      );
                    }}
                    disabled={
                      status === 1 ||
                      !isPos(depositAmount) ||
                      depositAmount.isGreaterThan(balance)
                    }
                  />
                </div>
              </div>
            </div>
            <div style={{ flexBasis: '2%' }} />
            {/* Withdraw QSD from DAO */}
            <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '60%', minWidth: '7em' }}>
                  <>
                    <BigNumberInput
                      adornment='QSD'
                      value={withdrawAmount}
                      setter={setWithdrawAmount}
                      disabled={status !== 0}
                    />
                    <MaxButton
                      onClick={() => {
                        setWithdrawAmount(stagedBalance);
                      }}
                    />
                  </>
                </div>
                <div style={{ width: '40%', minWidth: '7em' }}>
                  <Button
                    wide
                    icon={status === 0 ? <IconCircleMinus /> : <IconLock />}
                    label='Withdraw'
                    onClick={() => {
                      withdraw(
                        QSDS.addr,
                        toBaseUnitBN(withdrawAmount, QSD.decimals)
                      );
                    }}
                    disabled={
                      status === 1 ||
                      !isPos(withdrawAmount) ||
                      withdrawAmount.isGreaterThan(stagedBalance)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* total Issued */}
            <div style={{ flexBasis: '32%' }}>
              <BalanceBlock
                asset='Staged'
                balance={stagedBalance}
                suffix={'QSD'}
              />
            </div>
            <div style={{ flexBasis: '35%' }} />
            {/* Approve DAO to spend QSD */}
            <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label='Approve'
                onClick={() => {
                  approve(QSD.addr, QSDS.addr);
                }}
                disabled={user === ''}
              />
            </div>
          </div>
        )}
      </TopBorderBox>
    </Section>
  );
}

export default WithdrawDeposit;
