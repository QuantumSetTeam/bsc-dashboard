import React from 'react';
import { Section } from './Section';
import { Tile } from './Tile';

interface MigrationInstructionsProps {
  
  bodyInstructions: React.ReactNode;
}

export const MigrationInstructions: React.FC<MigrationInstructionsProps> = ({bodyInstructions }) => (
  <Section>
    <div
      style={{
        display: 'flex',
        marginBottom: 60,
        alignItems: 'stretch',
      }}
    >

      <Tile
        style={{
          flex: 'auto',
        }}
        line1='Claim your QSD/QSG in Binance Smart Chain'
        line3={bodyInstructions}
      />
    </div>
  </Section>
);
