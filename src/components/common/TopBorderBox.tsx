import { useTheme } from '@aragon/ui';
import React from 'react';
import { Colors } from '../../utils/colors';

interface TopBorderBoxProps extends React.ComponentProps<'div'> {
  title?: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
}

export const TopBorderBox: React.FC<TopBorderBoxProps> = ({
  style,
  title,
  body,
  action,
  children,
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme._name === 'dark';
  const borderColor = isDark ? Colors.BorderColorDark : Colors.BorderColorLight;
  return (
    <div>
      <div
        style={{
          height: 3,
          background: borderColor,
          borderRadius: 2,
          boxShadow: `0 0 5px ${borderColor}`,
        }}
      />
      <div
        style={{
          padding: '24px 12px',
        }}
      >
        {children ?? (
          <div
            style={{
              textAlign: 'center',

              ...style,
            }}
            {...props}
          >
            <div style={{ fontSize: 18, opacity: 0.6 }}>{title}</div>

            <div
              style={{
                fontSize: 22,
                marginTop: 14,
                fontWeight: 400,
                lineHeight: 1.5,
                fontFamily: 'aragon-ui-monospace, monospace',
              }}
            >
              {body}
            </div>

            {action && <div style={{ marginTop: 20 }}>{action}</div>}
          </div>
        )}
      </div>
    </div>
  );
};
