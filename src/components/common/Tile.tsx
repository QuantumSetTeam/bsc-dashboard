import { useTheme } from '@aragon/ui';
import React from 'react';
import { Colors } from '../../utils/colors';

interface TileProps extends React.ComponentProps<'div'> {
  line1?: string;
  line2?: React.ReactNode;
  line3?: React.ReactNode;
}

export const Tile: React.FC<TileProps> = ({
  style,
  line1,
  line2,
  line3,
  children,
  ...props
}) => {
  const theme = useTheme();
  const borderColor =
    theme._name === 'dark' ? Colors.BorderColorDark : Colors.BorderColorLight;
  return (
    <div
      style={{
        padding: 32,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 5px ${borderColor}`,
        borderRadius: 5,
        ...style,
      }}
      {...props}
    >
      {children || (
        <>
          <div style={{ fontSize: 20, opacity: 0.6, marginBottom: 16, overflowWrap: "break-word" }}>
            {line1}
          </div>

          {line2 && (
            <div
              style={{
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.5,
                fontFamily: 'aragon-ui-monospace, monospace',
                overflow: "auto"
              }}
            >
              {line2}
            </div>
          )}

          {line3 && <div style={{ marginTop: 16, fontSize: 16, overflowWrap: "break-word" }}>{line3}</div>}
        </>
      )}
    </div>
  );
};
