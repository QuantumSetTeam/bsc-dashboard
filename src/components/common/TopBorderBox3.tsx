import { useTheme } from '@aragon/ui';
import React from 'react';
import { Colors } from '../../utils/colors';

interface TopBorderBoxProps extends React.ComponentProps<'div'> {
    title?: string;
    body?: React.ReactNode;
    action?: React.ReactNode;
}

export const TopBorderBox3: React.FC<TopBorderBoxProps> = ({
    style,
    title,
    body,
    action,
    children,
    ...props
}) => {
    const theme = useTheme();
    const isDark = theme._name === 'dark';
    const borderColor = isDark
        ? Colors.BorderColorDark
        : Colors.BorderColorLight;
    return (
        <div>
            <div
                style={{
                    height: 1,
                    background: borderColor,
                    borderRadius: 0,
                    boxShadow: `0 0 0px ${borderColor}`,
                }}
            />
            <div
                style={{
                    padding: '10px 12px',
                }}
            >
                {children ?? (
                    <div
                        style={{
                            textAlign: 'center',
                            paddingBottom: 0,
                            paddingTop: 0,
                        }}
                        {...props}
                    >
                        <div
                            style={{
                                paddingBottom: 0,
                                paddingTop: 0,
                                fontSize: 22,
                                marginTop: 1,
                                fontWeight: 400,
                                lineHeight: 1.5,
                                fontFamily: 'aragon-ui-monospace, monospace',
                            }}
                        >
                            {body}
                        </div>

                        {action && <div style={{ marginTop: 0 }}>{action}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};
