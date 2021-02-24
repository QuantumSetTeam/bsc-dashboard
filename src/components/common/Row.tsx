import React from 'react';

interface RowProps {
  style?: React.CSSProperties;
}

export const Row: React.FC<RowProps> = ({ style, ...props }) => {
  const childrenCount = Array.isArray(props.children)
    ? props.children.length
    : 1;
  const gapsCount = childrenCount - 1;
  const columnWidth = (100 - gapsCount * 6) / childrenCount;
  const gridTemplateColumns = new Array(childrenCount)
    .fill(columnWidth + '%')
    .join(' ');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns,
        justifyContent: 'space-between',
        ...style,
      }}
      {...props}
    />
  );
};
