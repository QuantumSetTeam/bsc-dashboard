import React, { useEffect, useState } from 'react';
import { DataView, useTheme } from '@aragon/ui';

import { getAllRegulations } from '../../utils/infura';
import { SCD, SCDS } from '../../constants/tokens';
import { formatBN, toTokenUnitsBN } from '../../utils/number';
import BigNumber from 'bignumber.js';

type RegulationHistoryProps = {
  user: string;
};

type Regulation = {
  type: string;
  data: RegulationEntry;
};

type RegulationEntry = {
  epoch: string;
  price: string;
  deltaRedeemable: string;
  deltaDebt: string;
  deltaBonded: string;
};

function formatPrice(type, data) {
  return type === 'NEUTRAL'
    ? '1.00'
    : formatBN(toTokenUnitsBN(new BigNumber(data.price), SCD.decimals), 3);
}

function formatDeltaBonded(type, data) {
  return type === 'INCREASE'
    ? '+' +
        formatBN(toTokenUnitsBN(new BigNumber(data.newBonded), SCD.decimals), 2)
    : '+0.00';
}

function renderEntry({ type, data }: Regulation): string[] {
  return [
    data.epoch.toString(),
    formatPrice(type, data),
    formatDeltaBonded(type, data),
  ];
}

function RegulationHistory({ user }: RegulationHistoryProps) {
  const theme = useTheme();
  const isDark = theme._name === 'dark';
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [page, setPage] = useState(0);
  const [initialized, setInitialized] = useState(false);

  //Update User balances
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [allRegulations] = await Promise.all([
        getAllRegulations(SCDS.addr),
      ]);

      if (!isCancelled) {
        setRegulations(allRegulations);
        setInitialized(true);
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <div className={isDark ? 'table-container-dark' : undefined}>
      <DataView
        fields={['Epoch', 'Price', 'Δ Supply']}
        status={initialized ? 'default' : 'loading'}
        entries={regulations}
        entriesPerPage={10}
        page={page}
        onPageChange={setPage}
        renderEntry={renderEntry}
      />
    </div>
  );
}

export default RegulationHistory;
