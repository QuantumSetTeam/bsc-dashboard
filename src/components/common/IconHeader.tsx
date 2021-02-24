import { Header } from '@aragon/ui';
import React from 'react';

type IconHeaderProps = {
  icon: any;
  text: string;
};

function IconHeader({ icon, text }: IconHeaderProps) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: '2%', fontSize: 48 }}>{icon}</div>
        <div>
          <Header primary={text} />
        </div>
      </div>
    </>
  );
}

export default IconHeader;
