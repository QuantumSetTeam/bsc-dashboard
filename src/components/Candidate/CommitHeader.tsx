import React from 'react';

import NumberBlock from '../common/NumberBlock';

type CommitHeaderProps = {
    epoch: number;
    startEpoch: number;
    periodEpoch: number;
};

const CommitHeader = ({
    epoch,
    startEpoch,
    periodEpoch,
}: CommitHeaderProps) => (
    <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '25%' }}>
            <NumberBlock title='Current Epoch' num={epoch} />
        </div>
        <div style={{ width: '25%' }}>
            <NumberBlock title='Voting Starts' num={startEpoch} />
        </div>
        <div style={{ width: '25%' }}>
            <NumberBlock title='Voting Period' num={periodEpoch} />
        </div>
    </div>
);

export default CommitHeader;
