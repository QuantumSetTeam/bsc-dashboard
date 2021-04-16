import { useTheme } from '@aragon/ui';
import React from 'react';
import { Colors } from '../../utils/colors';

interface TopBorderBoxProps extends React.ComponentProps<'div'> {
    title?: string;
    body?: React.ReactNode;
    body2?: string | null;
    body3?: string;
    body4?: React.ReactNode;
    bodyASmall?: string;
    action?: React.ReactNode;
    buttonLabel?: string;
}

export const TopBorderBoxMod: React.FC<TopBorderBoxProps> = ({
    style,
    title,
    body,
    body2,
    body3,
    body4,
    bodyASmall,
    action,
    children,
    buttonLabel,
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
                    height: 3,
                    background: borderColor,
                    borderRadius: 2,
                    boxShadow: `0 0 5px ${borderColor}`,
                }}
            />
            <div
                style={{
                    padding: '12px 12px',
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
                        <div>
                            <img
                                src='./logo/logoSolid.png'
                                alt='Quantum Set Dollar Hero'
                                style={{
                                    zIndex: 1,
                                    position: 'relative',
                                    right: 0,
                                    top: 0,
                                    maxWidth: 100,
                                }}
                            ></img>
                        </div>
                        <div
                            style={{
                                paddingTop: 20,
                                fontSize: 30,
                                opacity: 1,
                            }}
                        >
                            {title}
                        </div>
                        <div
                            style={{
                                paddingTop: 5,
                                fontSize: 20,
                                opacity: 0.5,
                            }}
                        >
                            {body2}
                        </div>
                        <div
                            style={{
                                paddingTop: 1,
                                paddingBottom: 0,
                                fontSize: 20,
                                opacity: 0.5,
                            }}
                        >
                            {body3}
                        </div>
                        <div>{body4}</div>
                        <div
                            style={{
                                textAlign: 'left',
                                fontSize: 22,
                                marginTop: 0,
                                fontWeight: 400,
                                lineHeight: 1.5,
                                fontFamily: 'aragon-ui-monospace, monospace',
                            }}
                        ></div>

                        {action && (
                            <div style={{ marginTop: 20 }}>{action}</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
