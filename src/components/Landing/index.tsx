import { Button, LinkBase, useTheme, useViewport } from '@aragon/ui';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Colors } from '../../utils/colors';

export const Landing: React.FC = () => {
    const { above } = useViewport();
    const theme = useTheme();
    const isDark = theme._name === 'dark';

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
                padding: 24,
                borderRadius: 6,
                background: isDark ? Colors.CardDark : Colors.CardLight,
                flex: flexGrowSetting,
            }}
        >
            <div
                style={{
                    fontSize: 20,
                    marginBottom: 24,
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
                margin: '0 auto 80px',
            }}
        >
            <div
                style={{
                    padding: '120px 24px',
                    position: 'relative',
                }}
            >
                <div style={{ maxWidth: 500, zIndex: 2, position: 'relative' }}>
                    <div
                        style={{
                            fontSize: 50,
                            lineHeight: 1.2,
                            fontWeight: 700,
                            marginBottom: 40,
                        }}
                    >
                        <div>2nd Generation</div>
                        <div>Algorithmic</div>
                        <div>Stablecoin</div>
                    </div>

                    <div style={{ fontSize: 20 }}>
                        Quantum Set Dollar is a second generation algorithmic
                        stablecoin on Binance Smart Chain. Based on the original
                        Empty Set Dollar design with an improved model and
                        partially backed by a cashflow generating treasury
                        reserve that operates a buyback and burn strategy below
                        peg.
                    </div>

                    <div style={{ marginTop: 24 }}>
                        <NavLink
                            component={Button}
                            to='/dashboard/'
                            {...{
                                external: false,
                                label: 'Launch App',
                                mode: 'positive',
                            }}
                        />
                        <Button
                            style={{
                                display: 'inline-block',
                                marginLeft: 24,
                            }}
                        >
                            <a
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://discord.gg/au3CmE6gtd'
                                style={{ textDecoration: 'none' }}
                            >
                                Join our community
                            </a>
                        </Button>
                    </div>
                </div>

                <img
                    src='./about/lp.png'
                    alt='Quantum Set Dollar Hero'
                    style={{
                        zIndex: 1,
                        position: 'absolute',
                        right: 0,
                        top: 100,
                        maxWidth: 600,
                        opacity: above('large') ? 1 : 0.1,
                    }}
                />
            </div>

            <div>
                <div
                    style={{
                        fontSize: 50,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 24,
                    }}
                >
                    QSD Core Features
                </div>
                <div
                    style={{
                        padding: '0 12px',
                        display: 'flex',
                        flexWrap: above('medium') ? undefined : 'nowrap',
                    }}
                >
                    <Card
                        flexGrowSetting={0.8}
                        underlineTitle={true}
                        title='The Goldilocks Zone'
                        body1='The Goldilocks Zone is an area around the peg, created to better facilitate peg retention.'
                        body2='The Goldilocks Zone ($0.98 - $1.00) - Supply remains the same'
                        body3='Above the Goldilocks Zone ($1.02 - $1.10 +) - Supply expands up to a maximum of 5.4%'
                        body4='Below the Goldilock Zone (> $0.98) - Supply Contraction with Treasury Buyback & Burn'
                    />
                    <Card
                        flexGrowSetting={0.7}
                        underlineTitle={true}
                        title='Cashflow Generating Reserve'
                        body1='The QSD Treasury is funded by receiving a 15% share of expansion rewards.'
                        body2='These rewards are placed into high yield farms on BSC, the yield from which is used to buy back and burn QSD when it is below the Goldilocks Zone, ensuring long term peg support.'
                    />
                    <Card
                        flexGrowSetting={0.5}
                        underlineTitle={true}
                        title='Farming'
                        body1='Within and below the Goldilocks zone (> $1.02) users can farm QSG the Governance Token of QSD, QSD holders receive voting rights and a 10% share of expansion rewards.'
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Button style={{ marginRight: 40 }}>
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            style={{ textDecoration: 'none' }}
                            href='https://docs.quantumset.finance/faqs/frequently-asked-questions'
                        >
                            Read the FAQ
                        </a>
                    </Button>
                    <LinkBase href='https://docs.quantumset.finance/'>
                        Look at the documentation
                    </LinkBase>
                </div>
            </div>
        </div>
    );
};
