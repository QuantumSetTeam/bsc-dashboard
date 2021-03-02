import { Button, IconUpload } from '@aragon/ui';
import React from 'react';
import { SCDS } from '../../constants/tokens';
import { commit } from '../../utils/web3';
import TextBlock from '../common/TextBlock';

type CommitProps = {
  user: string;
  candidate: string;
  epoch: number;
  startEpoch: number;
  periodEpoch: number;
  initialized: boolean;
  approved: boolean;
};

function Commit({
  user,
  candidate,
  epoch,
  startEpoch,
  periodEpoch,
  initialized,
  approved,
}: CommitProps) {
  function status(
    epoch,
    startEpoch,
    periodEpoch,
    initialized,
    approved
  ): string {
    if (startEpoch === 0) {
      return 'N/A';
    }
    if (epoch < startEpoch) {
      return 'Unknown';
    }
    if (epoch < startEpoch + periodEpoch) {
      return 'Voting';
    }
    if (initialized) {
      return 'Committed';
    }
    if (approved) {
      return 'Approved';
    }
    return 'Rejected';
  }
  const s = status(epoch, startEpoch, periodEpoch, initialized, approved);

  return (
    <div style={{ display: 'flex', marginTop: 24 }}>
      {/* Status */}
      <div style={{ width: '30%' }}>
        <TextBlock label='Status' text={s} />
      </div>
      <div style={{ width: '40%' }} />
      {/* Commit candidate */}
      <div style={{ width: '30%', paddingTop: '2%' }}>
        <div style={{ display: 'flex' }}>
          <Button
            wide
            icon={<IconUpload />}
            label='Commit'
            onClick={() => {
              commit(SCDS.addr, candidate);
            }}
            disabled={user === '' || s !== 'Approved'}
          />
        </div>
      </div>
    </div>
  );
}

export default Commit;
