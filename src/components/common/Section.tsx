import React from 'react';

export interface SectionProps {
  style?: React.CSSProperties;
}

export const Section: React.FC<SectionProps> = ({ style, ...props }) => (
  <div style={{ marginTop: 80, ...style }} {...props} />
);
