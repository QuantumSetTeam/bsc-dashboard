import { IdentityBadge, Layout } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QSDS } from '../../constants/tokens';
import { proposalStatus } from '../../utils/gov';
import {
  getApproveFor,
  getBalanceBonded,
  getEpoch,
  getIsInitialized,
  getPeriodFor,
  getRecordedVote,
  getRejectFor,
  getStartFor,
  getStatusOf,
  getTokenTotalSupply,
  getTotalBondedAt,
} from '../../utils/infura';
import { toTokenUnitsBN } from '../../utils/number';
import { getPoolGovAddress } from '../../utils/pool';
import { TopBorderSection } from '../common';
import IconHeader from '../common/IconHeader';
import Commit from './Commit';
import CommitHeader from './CommitHeader';
import Vote from './Vote';
import VoteHeader from './VoteHeader';

function Candidate({ user }: { user: string }) {
  const { candidate } = useParams();

  const [approveFor, setApproveFor] = useState(new BigNumber(0));
  const [rejectFor, setRejectFor] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [vote, setVote] = useState(0);
  const [status, setStatus] = useState(0);
  const [userStake, setUserStake] = useState(new BigNumber(0));
  const [epoch, setEpoch] = useState(0);
  const [startEpoch, setStartEpoch] = useState(0);
  const [periodEpoch, setPeriodEpoch] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user === '') {
      setVote(0);
      setStatus(0);
      setUserStake(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolGovAddress();

      const [voteStr, statusStr, userStakeStr] = await Promise.all([
        getRecordedVote(QSDS.addr, user, candidate),
        getStatusOf(QSDS.addr, user),
        getBalanceBonded(poolAddress, user),
      ]);

      if (!isCancelled) {
        setVote(parseInt(voteStr, 10));
        setStatus(parseInt(statusStr, 10));
        setUserStake(toTokenUnitsBN(userStakeStr, QSDS.decimals));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, candidate]);

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      let [
        approveForStr,
        rejectForStr,
        totalStakeStr,
        epochStr,
        startForStr,
        periodForStr,
        isInitialized,
      ] = await Promise.all([
        getApproveFor(QSDS.addr, candidate),
        getRejectFor(QSDS.addr, candidate),
        getTokenTotalSupply(QSDS.addr),
        getEpoch(QSDS.addr),
        getStartFor(QSDS.addr, candidate),
        getPeriodFor(QSDS.addr, candidate),
        getIsInitialized(QSDS.addr, candidate),
      ]);

      const epochN = parseInt(epochStr, 10);
      const startN = parseInt(startForStr, 10);
      const periodN = parseInt(periodForStr, 10);

      const endsAfter = startN + periodN - 1;
      if (epochN > endsAfter) {
        totalStakeStr = await getTotalBondedAt(QSDS.addr, endsAfter);
      }

      if (!isCancelled) {
        setApproveFor(toTokenUnitsBN(approveForStr, QSDS.decimals));
        setRejectFor(toTokenUnitsBN(rejectForStr, QSDS.decimals));
        setTotalStake(toTokenUnitsBN(totalStakeStr, QSDS.decimals));
        setEpoch(epochN);
        setStartEpoch(startN);
        setPeriodEpoch(periodN);
        setInitialized(isInitialized);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [candidate]);

  return (
    <Layout>
      <IconHeader icon={<i className='fas fa-poll' />} text='Candidate' />
      <IdentityBadge entity={candidate} shorten={false} />

      <VoteHeader
        approveFor={approveFor}
        rejectFor={rejectFor}
        totalStake={totalStake}
        showParticipation={startEpoch > 106}
      />

      <Vote
        candidate={candidate}
        stake={userStake}
        vote={vote}
        status={status}
      />

      <TopBorderSection title='Commit'>
        <CommitHeader
          epoch={epoch}
          startEpoch={startEpoch}
          periodEpoch={periodEpoch}
        />

        <Commit
          user={user}
          candidate={candidate}
          epoch={epoch}
          startEpoch={startEpoch}
          periodEpoch={periodEpoch}
          initialized={initialized}
          approved={
            proposalStatus(
              epoch,
              startEpoch,
              periodEpoch,
              false,
              approveFor,
              rejectFor,
              totalStake
            ) === 'Approved'
          }
        />
      </TopBorderSection>
    </Layout>
  );
}

export default Candidate;
