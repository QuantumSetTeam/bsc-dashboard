import React from 'react';
import { LinkBase, useTheme } from '@aragon/ui';
import ChangeModeButton from './SwitchTheme';

type FooterProps = {
  updateTheme: Function;
  hasWeb3: boolean;
};

function Footer({ updateTheme, hasWeb3 }: FooterProps) {
  const currentTheme = useTheme();

  return (
    <>
      <div
        style={{
          borderTop: '1px solid ' + currentTheme.border,
          backgroundColor: currentTheme.surfaceSelected,
          textAlign: 'center',
          fontSize: '14px',
        }}
      >
        <div
          style={{
            maxWidth: '1104px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <div
            style={{
              padding: '2% 0',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* <FooterLink
                icon={<i className='fab fa-github' />}
                href={'https://www.github.com/emptysetsquad/dollar'}
              /> */}
              <FooterLink
                icon={<i className='fab fa-twitter' />}
                href={'https://twitter.com/quantumset'}
              />
              <FooterLink
                icon={<i className='fab fa-medium' />}
                href={'https://medium.com/@quantumsetdollar'}
              />
              <FooterLink
                icon={<i className='fab fa-telegram' />}
                href={'https://t.me/QuantumSetDollar'}
              />
              <FooterLink
                icon={<i className='fab fa-discord' />}
                href={'https://discord.gg/au3CmE6gtd'}
              />
            </div>

            <div style={{ marginTop: '4px' }}>
              <ChangeModeButton hasWeb3={hasWeb3} updateTheme={updateTheme} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type FooterLinkProp = {
  icon: any;
  href: string;
};

function FooterLink({ icon, href }: FooterLinkProp) {
  return (
    <LinkBase href={href} style={{ marginLeft: '8px', marginRight: '8px' }}>
      <span style={{ fontSize: 32 }}>{icon}</span>
    </LinkBase>
  );
}

export default Footer;
