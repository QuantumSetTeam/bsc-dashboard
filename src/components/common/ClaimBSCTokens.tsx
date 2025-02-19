import { Button } from '@aragon/ui';
import React from 'react';
import { TopBorderSection } from './index';
import { claimBSC } from '../../utils/web3';
import { claimAddress } from '../../constants/contracts';


interface ClaimBSCProps {
  user: string;
}

export const ClaimBSCTokens: React.FC<ClaimBSCProps> = ({
  user
}) => {

  return (
    <TopBorderSection title='Claim'>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center' }}>
        <div style={{ flexBasis: '100%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100%', minWidth: '6em' }}>
            <Button
              onClick={() => {
                claimBSC(claimAddress);
              }}
              disabled={user === ''}
            >
              Claim all QSD + QSG
            </Button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
        <span style={{ opacity: 0.5 }}>
        </span>
      </div>
    </TopBorderSection>
  );
};
