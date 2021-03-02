import { Button, LinkBase, useTheme, useViewport } from '@aragon/ui';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Colors } from '../../utils/colors';

export const Landing: React.FC = () => {
  const { above } = useViewport();
  const theme = useTheme();
  const isDark = theme._name === 'dark';

  const Card: React.FC<{
    underlineTitle?: boolean;
    title: string;
    body: string;
  }> = ({ underlineTitle, title, body }) => (
    <div
      style={{
        margin: 12,
        padding: 24,
        borderRadius: 6,
        background: isDark ? Colors.CardDark : Colors.CardLight,
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 24 }}>
        {underlineTitle ? (
          <span style={{ textDecoration: 'underline' }}>{title}</span>
        ) : (
          { title }
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 300 }}>{body}</div>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: 1148,
        margin: '0 auto 80px',
      }}
    >
      <div
        style={{
          padding: '120px 24px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: 500, zIndex: 2, position: 'relative' }}>
          <div
            style={{
              fontSize: 50,
              lineHeight: 1.2,
              fontWeight: 700,
              marginBottom: 40,
            }}
          >
            <div>Experimental</div>
            <div>Stablecoin</div>
            <div>Protocol</div>
          </div>

          <div style={{ fontSize: 20 }}>
            Smart Chain Dollar (QSD) is a decentralised, experimental
            stablecoin, using previous stablecoin designs as its foundation.
            Updated mechanics ensure improved peg stability and the ability to
            easily iterate provides an experimental edge for innovation limited
            only by imagination.
          </div>

          <div style={{ marginTop: 24 }}>
            <NavLink
              component={Button}
              to='/dashboard/'
              {...{
                external: false,
                label: 'Launch App',
                mode: 'positive',
              }}
            />
            <Button
              style={{
                display: 'inline-block',
                marginLeft: 24,
              }}
            >
              <a
                target='_blank'
                rel="noopener noreferrer"
                href='https://discord.gg/au3CmE6gtd'
                style={{ textDecoration: 'none' }}
              >
                Join our community
              </a>
            </Button>
          </div>
        </div>

        <img
          src='./about/lp.png'
          alt='Smart Chain Dollar Hero'
          style={{
            zIndex: 1,
            position: 'absolute',
            right: 0,
            top: 100,
            maxWidth: 600,
            opacity: above('large') ? 1 : 0.1,
          }}
        />
      </div>

      <div>
        <div
          style={{
            fontSize: 50,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 24,
          }}
        >
          QSD Core Features
        </div>
        <div
          style={{
            padding: '0 12px',
            display: 'flex',
            flexWrap: above('medium') ? undefined : 'wrap',
          }}
        >
          <Card
            underlineTitle={true}
            title='Expansion Above Peg'
            body='When the price of QSD is above $1 the supply will expand at a maximum rate of 5.4% per epoch and rewards will be distributed between bonded QSD and LP. There are no lock-ups on rewards which encourages selling above the peg.'
          />
          <Card
            underlineTitle={true}
            title='Incentives Below Peg'
            body='When the price of QSD is below $1, holders will be able to earn rewards in the form of the SCD Governance Token (QSG), by staking their QSD. Secondarily, the ability to bond QSD will only be available below peg.'
          />
          <Card
            underlineTitle={true}
            title='Community Ownership'
            body='Smart Chain Dollar will be governed by holders of the SCD Governance Token. QSG can be farmed by community members from Epoch 73 onwards, whilst QSD is below the peg of $1. QSG holders will also control the Treasury.'
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button style={{ marginRight: 40 }}>
            <a
              target='_blank'
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              href='https://docs.quantumset.finance/faqs/frequently-asked-questions'
            >
              Read the FAQ
            </a>
          </Button>
          <LinkBase href='https://docs.quantumset.finance/'>
            Look at the documentation
          </LinkBase>
        </div>
      </div>
    </div>
  );
};
