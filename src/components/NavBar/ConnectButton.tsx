import {
  Button,
  IconConnect,
  IconPower,
  IdentityBadge,
  LinkBase,
} from '@aragon/ui';
import React, { useState } from 'react';
import { useWallet } from 'use-wallet';
import { connect } from '../../utils/web3';
import ConnectModal from './ConnectModal';
import TotalBalance from './TotalBalance';

type connectButtonProps = {
  hasWeb3: boolean;
  user: string;
  setUser: Function;
};

function ConnectButton({ hasWeb3, user, setUser }: connectButtonProps) {
  const { status, reset } = useWallet();

  const [isModalOpen, setModalOpen] = useState(false);

  const connectWeb3 = async (wallet) => {
    connect(wallet.ethereum);
    setUser(wallet.account);
  };

  const disconnectWeb3 = async () => {
    setUser('');
    reset();
  };

  const toggleModal = () => setModalOpen(!isModalOpen);

  return status === 'connected' ? (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1' }} />
      <div style={{ display: 'flex' }}>
        <div>
          <LinkBase
            onClick={disconnectWeb3}
            style={{ marginRight: '8px', height: '24px' }}
          >
            <IconPower />
          </LinkBase>
        </div>
        <div style={{ flex: '1', textAlign: 'right' }}>
          <IdentityBadge entity={user} />
        </div>
        <div style={{ flex: '1', textAlign: 'right', marginLeft: 24 }}>
          <TotalBalance user={user} />
        </div>
      </div>
    </div>
  ) : (
    <>
      <ConnectModal
        visible={isModalOpen}
        onClose={toggleModal}
        onConnect={connectWeb3}
      />
      <Button
        icon={<IconConnect />}
        label='Connect'
        onClick={toggleModal}
        disabled={!hasWeb3}
      />
    </>
  );
}

export default ConnectButton;
