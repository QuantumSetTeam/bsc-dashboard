import React from 'react';
import { Section } from './Section';
import { Tile } from './Tile';

interface GuideProps {
  aprs?: {
    hourly: any;
    daily: any;
    weekly: any;
    monthly: any;
  };
  bodyInstructions: React.ReactNode;
}

export const Guide: React.FC<GuideProps> = ({ aprs, bodyInstructions }) => (
  <Section>
    <div
      style={{
        display: 'flex',
        marginBottom: 60,
        alignItems: 'stretch',
      }}
    >
      {aprs && (
        <Tile
          style={{
            marginRight: 64,
            flexBasis: '33%',
          }}
          line1='APR'
          line2={
            <div style={{ fontSize: 24 }}>
              {/* <div>Hourly: {aprs.hourly}</div> */}
              <div>Daily: {aprs.daily}</div>
              <div>Weekly: {aprs.weekly}</div>
              <div>Monthly: {aprs.monthly}</div>
            </div>
          }
        />
      )}
      <Tile
        style={{
          flex: 'auto',
        }}
        line1='Instructions'
        line3={bodyInstructions}
      />
    </div>
  </Section>
);
