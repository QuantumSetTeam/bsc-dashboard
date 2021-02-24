import { Header } from '@aragon/ui';
import React from 'react';
import { Section } from './Section';
import { TopBorderBox } from './TopBorderBox';

interface TopBorderSectionProps extends React.ComponentProps<'div'> {
  title: string;
}

export const TopBorderSection: React.FC<TopBorderSectionProps> = ({
  title,
  children,
}) => (
  <Section>
    <Header primary={title} />
    <TopBorderBox>{children}</TopBorderBox>
  </Section>
);
