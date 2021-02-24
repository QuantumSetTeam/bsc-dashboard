import React, { useState, useEffect } from 'react';
import { Header, Layout } from '@aragon/ui';

import {getEpoch, getEpochTime,
} from '../../utils/infura';
import {QSDS} from "../../constants/tokens";
import AdvanceEpoch from './AdvanceEpoch';
import EpochPageHeader from "./Header";
import IconHeader from "../common/IconHeader";

function EpochDetail({ user }: {user: string}) {

  const [epoch, setEpoch] = useState(0);
  const [epochTime, setEpochTime] = useState(0);
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [epochStr, epochTimeStr] = await Promise.all([
        getEpoch(QSDS.addr),
        getEpochTime(QSDS.addr),
      ]);

      if (!isCancelled) {
        setEpoch(parseInt(epochStr, 10));
        setEpochTime(parseInt(epochTimeStr, 10));
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
    <Layout>
      <IconHeader icon={<i className="fas fa-stream"/>} text="Epoch"/>

      <EpochPageHeader
        epoch={epoch}
        epochTime={epochTime}
      />

      <Header primary="Advance Epoch" />

      <AdvanceEpoch
        user={user}
        epoch={epoch}
        epochTime={epochTime}
      />
    </Layout>
  );
}

export default EpochDetail;
