import { Button, IconCircleMinus, IconCirclePlus, IconLock } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { MAX_UINT256 } from '../../constants/values';
import { isPos } from '../../utils/number';
import BigNumberInput from './BigNumberInput';
import { BalanceBlock, MaxButton } from '../common/index';
import { TopBorderSection } from './TopBorderSection';

interface WithdrawDepositProps {
  balance: BigNumber;
  allowance: BigNumber;
  stagedBalance: BigNumber;
  status: number;
  suffix: string;
  disabled: boolean;

  handleApprove: () => void;
  handleDeposit: (depositAmount: BigNumber, callback: () => void) => void;
  handleWithdraw: (withdrawAmount: BigNumber, callback: () => void) => void;
}

export const WithdrawDeposit: React.FC<WithdrawDepositProps> = ({
  balance,
  allowance,
  stagedBalance,
  status,
  suffix,
  disabled,

  handleApprove,
  handleDeposit,
  handleWithdraw,
}) => {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  return (
    <TopBorderSection title='Stage'>
      {allowance.comparedTo(MAX_UINT256) === 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* total Issued */}
          <div style={{ flexBasis: '32%' }}>
            <BalanceBlock
              asset='Staged'
              balance={stagedBalance}
              suffix={suffix}
            />
          </div>
          {/* Deposit SCD into DAO */}
          <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '60%', minWidth: '6em' }}>
                <>
                  <BigNumberInput
                    adornment={suffix}
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
                    handleDeposit(depositAmount, () => {
                      setDepositAmount(new BigNumber(0));
                    });
                  }}
                  disabled={
                    status !== 0 ||
                    !isPos(depositAmount) ||
                    depositAmount.isGreaterThan(balance) ||
                    disabled
                  }
                />
              </div>
            </div>
          </div>
          <div style={{ flexBasis: '2%' }} />
          {/* Withdraw SCD from DAO */}
          <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '60%', minWidth: '7em' }}>
                <>
                  <BigNumberInput
                    adornment={suffix}
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
                  onClick={() =>
                    handleWithdraw(withdrawAmount, () => {
                      setWithdrawAmount(new BigNumber(0));
                    })
                  }
                  disabled={status !== 0 || !isPos(withdrawAmount) || disabled}
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
              suffix={suffix}
            />
          </div>
          <div style={{ flexBasis: '35%' }} />
          {/* Approve DAO to spend SCD */}
          <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
            <Button
              wide
              icon={<IconCirclePlus />}
              label='Approve'
              onClick={handleApprove}
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </TopBorderSection>
  );
};
