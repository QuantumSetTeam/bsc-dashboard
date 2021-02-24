import React from 'react';

type EpochBlockProps = {
  epoch: string
}

function EpochBlock({ epoch }: EpochBlockProps) {
  return (
    <>
      <div style={{ fontSize: 16, padding: 3 }}>Epoch</div>
      <div style={{ fontSize: 24, padding: 3, fontWeight: 400, lineHeight: 1.5, fontFamily: 'aragon-ui-monospace, monospace'}}>{epoch}</div>
      <div style={{}}>Advance -&gt; {epoch.split("-")[0]}</div>
    </>
  );
}

export default EpochBlock;
