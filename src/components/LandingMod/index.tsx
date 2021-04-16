import { Button, useTheme, useViewport } from '@aragon/ui';
import React from 'react';
import { Colors } from '../../utils/colors';
import { Tile } from '../common';

interface LandingModProps {
    tvl?: string;
}

export const LandingMod: React.FC<LandingModProps> = ({ tvl }) => {
    const { above } = useViewport();
    const theme = useTheme();
    const isDark = theme._name === 'dark';

    // eslint-disable-next-line
    const Card: React.FC<{
        underlineTitle?: boolean;
        title: string;
        body1: string;
        body2?: string;
        body3?: string;
        body4?: string;
        flexGrowSetting?: number;
    }> = ({
        underlineTitle,
        title,
        body1,
        body2,
        body3,
        body4,
        flexGrowSetting,
    }) => (
        <div
            style={{
                margin: 12,
                padding: 10,
                borderRadius: 6,
                background: isDark ? Colors.CardDark : Colors.CardLight,
                flex: flexGrowSetting,
            }}
        >
            <div
                style={{
                    fontSize: 20,
                    marginBottom: 10,
                    alignSelf: 'flex-start',
                    flex: flexGrowSetting,
                }}
            >
                {underlineTitle ? (
                    <span style={{ textDecoration: 'underline' }}>{title}</span>
                ) : (
                    { title }
                )}
            </div>
            <div style={{ fontSize: 16, fontWeight: 300 }}>{body1}</div>
            <br />
            <div style={{ fontSize: 16, fontWeight: 300 }}>{body2}</div>
            <br />
            <div style={{ fontSize: 16, fontWeight: 300 }}>{body3}</div>
            <br />
            <div style={{ fontSize: 16, fontWeight: 300 }}>{body4}</div>
        </div>
    );

    return (
        <div
            style={{
                maxWidth: 1148,
                margin: '0 auto 50px',
            }}
        >
            <div
                style={{
                    padding: '0px 12',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        maxWidth: 600,
                        zIndex: 2,
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            fontSize: 40,
                            lineHeight: 1.2,
                            fontWeight: 700,
                            marginBottom: 15,
                        }}
                    >
                        <div>2nd Generation </div>
                        <div>Algorithmic Stablecoin</div>
                    </div>
                    <div
                        style={{
                            fontSize: 16,
                            lineHeight: 1.2,
                            fontWeight: 300,
                            marginBottom: 7,
                            paddingRight: 40,
                            paddingBottom: 10,
                        }}
                    >
                        <div>
                            QSD Rewards above peg, BUSD Rewards at peg, QSG
                            rewards belog peg. Partially backed by a
                            cashflow-generating, treasury reserve
                            buy-back-and-burn strategy.
                        </div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <Button mode='positive'>
                            <a
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{ textDecoration: 'none' }}
                                href='https://docs.quantumset.finance/'
                            >
                                Documents
                            </a>
                        </Button>
                    </div>
                </div>
                <div
                    style={{
                        zIndex: 1,
                        position: 'absolute',
                        right: 100,
                        top: 20,
                        maxWidth: 600,
                        paddingTop: 5,
                        opacity: above('large') ? 1 : 0.1,
                    }}
                >
                    <Tile
                        line1='Total Value Locked:'
                        line2={'$' + tvl}
                        line3={''}
                    />
                </div>
            </div>
        </div>
    );
};
