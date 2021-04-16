import React from 'react';
import { SectionMod } from './Section';
import { TopBorderBox3 } from './TopBorderBox3';

interface TopBorderSectionModProps extends React.ComponentProps<'div'> {
    title?: string;
}

export const TopBorderSectionMod: React.FC<TopBorderSectionModProps> = ({
    title,
    children,
}) => (
    <SectionMod>
        <TopBorderBox3>{children}</TopBorderBox3>
    </SectionMod>
);
