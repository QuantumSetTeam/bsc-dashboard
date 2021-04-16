import { Button, LinkBase } from '@aragon/ui';
import React, { ComponentProps, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
//Commented By RDN
// import { Layout } from '@aragon/ui';
import {
    IconHeader,
    Row,
    Tile,
    TopBorderBoxMod,
    TopBorderSectionMod,
    BalanceBlockMod,
    BRow,
    BCol,
    BContainer,
} from '../common';
import Regulation from '../Regulation';
import {
    QSD,
    BUSD,
    newPoolBondingAdd,
    newPoolLPAdd,
} from '../../constants/tokens';
import {
    getExpansionAmount,
    getInstantaneousQSDPrice,
    getLPBondedLiquidity,
    getTokenTotalSupply,
    getPoolTotalBonded,
    getPoolTotalStaged,
    getLPPoolTotalClaimable1,
    getPoolTotalClaimable1,
    getPoolTotalRewarded1,
} from '../../utils/infura';
import { formatBN, toFloat, toTokenUnitsBN } from '../../utils/number';
import { epochformatted } from '../../utils/calculation';
import BigNumber from 'bignumber.js';
import { LandingMod } from '../LandingMod';

type HomePageProps = {
    user: string;
};

function HomePage({ user }: HomePageProps) {
    const [epochTime, setEpochTime] = useState('0-00:00:00');
    const [totalSupply, setTotalSupply] = useState<BigNumber | null>(null);
    const [QSDPrice, setQSDPrice] = useState<BigNumber | null>(null);

    const [daoBonded, setTotalBonded] = useState(new BigNumber(0));
    // const [daoStaged, setTotalStaged] = useState(new BigNumber(0));
    // const [poolLPLiquidity, setPoolLiquidity] = useState(new BigNumber(0));
    // const [poolTotalRewarded, setPoolTotalRewarded] = useState(
    //     new BigNumber(0)
    // );
    // const [poolTotalClaimable, setPoolTotalClaimable] = useState(
    //     new BigNumber(0)
    // );

    const [lpQSDLiquidity, setLpQSDLiquidity] = useState<number | null>(null);
    const [lpDaiLiquidity, setLpDaiLiquidity] = useState<number | null>(null);
    const [expansionAmount, setExpansionAmount] = useState<number | null>(null);

    const [lpTVL, setLPTVL] = useState<string | null>(null);
    const [daoTVL, setDaoTVL] = useState<string | null>(null);

    const [totalTVL, setTotalTVL] = useState<string>('');

    const [tokenPriceStr, setTokenPriceStr] = useState<string>('...');

    useEffect(() => {
        let isCancelled = false;

        async function updateInfo() {
            const poolBonding = newPoolBondingAdd.addr;

            const [
                supply,
                tokenPrice,
                liquidityLp,
                expansion,
                daoBondedStr,
                daoStagedStr,
                daoRewardedStr,
                daoClaimableStr,
                lpRewardedStr,
                lpClaimable1Str,
            ] = await Promise.all([
                getTokenTotalSupply(QSD.addr),
                getInstantaneousQSDPrice(),
                getLPBondedLiquidity(),
                getExpansionAmount(),
                getPoolTotalBonded(poolBonding),
                getPoolTotalStaged(poolBonding),
                getPoolTotalRewarded1(poolBonding),
                getPoolTotalClaimable1(poolBonding),
                getPoolTotalRewarded1(newPoolLPAdd.addr),
                getLPPoolTotalClaimable1(newPoolLPAdd.addr),
            ]);

            setTotalSupply(toTokenUnitsBN(supply, 18));
            setQSDPrice(toTokenUnitsBN(tokenPrice, 18));
            setLpQSDLiquidity(liquidityLp.QSD);
            setLpDaiLiquidity(liquidityLp.busd);
            setExpansionAmount(expansion);

            // FIRST PROCESS POOLBONDING(DAO) TVL //
            const daoTotalBonded = toTokenUnitsBN(
                new BigNumber(daoBondedStr),
                18
            );

            setTotalBonded(daoTotalBonded);

            const daoTotalStaged = toTokenUnitsBN(
                new BigNumber(daoStagedStr),
                18
            );

            // setTotalStaged(daoTotalStaged);

            const daoQSDRewarded = toTokenUnitsBN(
                new BigNumber(daoRewardedStr),
                18
            );

            // console.log(daoRewardedStr);

            const daoQSDClaimable = toTokenUnitsBN(
                new BigNumber(daoClaimableStr),
                18
            );

            const daoTVLTokens = daoTotalBonded
                .plus(daoTotalStaged)
                .plus(daoQSDRewarded)
                .plus(daoQSDClaimable);

            let daoTVL = daoTVLTokens.times(tokenPrice);

            daoTVL = toTokenUnitsBN(daoTVL, 18);

            // Now stringify daoTVL to pass it to React components
            setDaoTVL(formatBN(daoTVL, 2));

            // NOW PROCESS LIQUIDITY TVL //
            const tokenPriceNumber = toFloat(toTokenUnitsBN(tokenPrice, 18));

            const lpTotalBUSD: number =
                liquidityLp.QSD * tokenPriceNumber + liquidityLp.busd;

            // Get pool total rewarded and claimable
            const lpTotalRewarded = toTokenUnitsBN(
                new BigNumber(lpRewardedStr),
                18
            );

            const lpTotalClaimable = toTokenUnitsBN(
                new BigNumber(lpClaimable1Str),
                18
            );

            let lpRewardAndClaimableQSD = lpTotalRewarded.plus(
                lpTotalClaimable
            );

            let lpRewardedClaimable = toFloat(
                toTokenUnitsBN(lpRewardAndClaimableQSD.times(tokenPrice), 18)
            );

            const lpTVL = lpTotalBUSD + lpRewardedClaimable;

            let lpTVLStr = (Math.round(lpTVL * 100) / 100).toLocaleString();

            setLPTVL(lpTVLStr);

            // GET TOTAL TVL //

            const totalTVL = lpTVL + toFloat(daoTVL);

            const totalTVLStr = (
                Math.round(totalTVL * 100) / 100
            ).toLocaleString();

            setTotalTVL(totalTVLStr);

            // Set token price in string
            setTokenPriceStr(tokenPriceNumber.toLocaleString());
        }

        async function updateUserInfo() {
            if (!isCancelled) {
                setEpochTime(epochformatted());
            }
        }

        updateInfo();
        updateUserInfo();

        // console.log('lpTVL is ' + lpTVL);

        const id = setInterval(updateUserInfo, 1000);

        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true;
            clearInterval(id);
        };
    }, [user]);

    // let daoWeeklyYield = '...';
    //let daoHourlyYield = '...';
    // let daoDailyYield = '...';
    // let daoMonthlyYield = '...';
    let daoAnnualYield = '0';

    // let lpWeeklyYield = '...';
    //let lpHourlyYield = '...';
    // let lpDailyYield = '...';
    // let lpMonthlyYield = '...';
    let lpAnnualYield = '0';

    // Define number formatting
    var options = { minimumFractionDigits: 0, maximumFractionDigits: 2 };
    var numberFormat = new Intl.NumberFormat('en-US', options);

    // Calculate LP APR (4 hrs)
    if (QSDPrice && lpQSDLiquidity && lpDaiLiquidity && expansionAmount) {
        const totalBUSD = lpQSDLiquidity * toFloat(QSDPrice) + lpDaiLiquidity;
        const busdToAdd = (expansionAmount / 2) * toFloat(QSDPrice);

        const lpYield = (busdToAdd / totalBUSD) * 100;

        //lpHourlyYield = numberFormat.format(lpYield / 4) + '%';
        // lpDailyYield = numberFormat.format(lpYield * 6) + '%';
        // lpWeeklyYield = numberFormat.format(lpYield * 6 * 7) + '%';
        // lpMonthlyYield = numberFormat.format(lpYield * 6 * 30) + '%';
        lpAnnualYield = numberFormat.format(lpYield * 6 * 30 * 12) + '%';
    }

    // Calculate DAO APR (4 hrs)
    if (QSDPrice && daoBonded && expansionAmount) {
        const totalQSD = toFloat(daoBonded);
        const QSDToAdd = expansionAmount / 2;

        const daoYield = (QSDToAdd / totalQSD) * 100;

        //daoHourlyYield = numberFormat.format(daoYield / 4) + '%';
        // daoDailyYield = numberFormat.format(daoYield * 6) + '%';
        // daoWeeklyYield = numberFormat.format(daoYield * 6 * 7) + '%';
        // daoMonthlyYield = numberFormat.format(daoYield * 6 * 30) + '%';
        daoAnnualYield = numberFormat.format(daoYield * 6 * 30 * 12) + '%';
    }

    // eslint-disable-next-line
    const curEpoch = Number(epochTime.split('-')[0]);

    return (
        <BContainer>
            <LandingMod tvl={totalTVL} />
            {/*Commented By RDN*/}
            {/* <Layout> */}
            <div style={{ margin: '20px 0', paddingTop: '0' }}>
                {/* </BContainer> */}

                <SectionMod>
                    <IconHeader
                        icon={<i className='fas fa-chart-line' />}
                        text='Invest'
                    />
                    <Row>
                        <TopBorderBoxMod
                            title='QSD/BUSD LP'
                            bodyASmall='TVL'
                            body={lpTVL ? '$' + lpTVL : '...'}
                            body2={'Deposit QSD/BUSD LP'}
                            body3={'Earn QSD + BUSD'}
                            body4={
                                <TopBorderSectionMod>
                                    {/* <div
                                    style={{
                                        height: 1,
                                        background: borderColor,
                                        borderRadius: 2,
                                        boxShadow: `0 0 5px ${borderColor}`,
                                        paddingTop: 0.5,
                                    }}
                                /> */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingBottom: 2,
                                        }}
                                    >
                                        <div>
                                            <BalanceBlockMod
                                                asset='TVL'
                                                balance={lpTVL}
                                                prefix={'$'}
                                            />
                                        </div>
                                        <div>
                                            <BalanceBlockMod
                                                asset='APR'
                                                balance={lpAnnualYield}
                                                suffix={''}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: '100%',
                                            paddingTop: 5,
                                            textAlign: 'center',
                                            paddingBottom: 1,
                                        }}
                                    >
                                        {/* Start button here */}
                                        <div style={{ paddingTop: 2 }}>
                                            <NavLink
                                                location={undefined}
                                                component={Button}
                                                to='/lp/'
                                                {...{ external: true }}
                                            >
                                                Deposit QSD/BUSD LP
                                            </NavLink>
                                        </div>
                                        <span style={{ opacity: 0.5 }}>
                                            {/* Unbond to make rewards claimable after your status is Unlocked */}
                                        </span>
                                    </div>
                                </TopBorderSectionMod>
                            }
                            action={
                                <a
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    style={{ textDecoration: 'none' }}
                                    href={`https://exchange.pancakeswap.finance/#/add/${QSD.addr}/${BUSD.addr}`}
                                >
                                    <u>Add Liquidity</u>
                                </a>
                            }
                        />
                        <TopBorderBoxMod
                            title='QSD'
                            bodyASmall='TVL'
                            body={lpTVL ? '$' + lpTVL : '...'}
                            body2={'Deposit QSD'}
                            body3={'Earn QSD + BUSD + QSG'}
                            body4={
                                <TopBorderSectionMod>
                                    {/* <div
                                    style={{
                                        height: 1,
                                        background: borderColor,
                                        borderRadius: 2,
                                        boxShadow: `0 0 5px ${borderColor}`,
                                        paddingTop: 0.5,
                                    }}
                                /> */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingBottom: 2,
                                        }}
                                    >
                                        <div>
                                            <BalanceBlockMod
                                                asset='TVL'
                                                balance={daoTVL}
                                                prefix={'$'}
                                            />
                                        </div>
                                        <div>
                                            <BalanceBlockMod
                                                asset='APR'
                                                balance={daoAnnualYield}
                                                suffix={''}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: '100%',
                                            paddingTop: '2%',
                                            textAlign: 'center',
                                            paddingBottom: 0,
                                        }}
                                    >
                                        {/* Start button here */}
                                        <div style={{ paddingTop: 2 }}>
                                            <NavLink
                                                component={Button}
                                                to='/qsd'
                                                {...{ external: true }}
                                            >
                                                Deposit QSD
                                            </NavLink>
                                        </div>
                                        <span style={{ opacity: 0.5 }}>
                                            {/* Unbond to make rewards claimable after your status is Unlocked */}
                                        </span>
                                    </div>
                                </TopBorderSectionMod>
                            }
                            action={
                                <a
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    style={{ textDecoration: 'none' }}
                                    href={`https://exchange.pancakeswap.finance//#/page/swap?outputCurrency=${QSD.addr}`}
                                >
                                    <u>Buy QSD</u>
                                </a>
                            }
                        />
                        <TopBorderBoxMod
                            title='QSG'
                            bodyASmall='TVL'
                            body={lpTVL ? '$' + lpTVL : '...'}
                            body2={'Deposit QSG'}
                            body3={'Earn QSD'}
                            body4={
                                <TopBorderSectionMod>
                                    {/* <div
                                    style={{
                                        height: 1,
                                        background: borderColor,
                                        borderRadius: 2,
                                        boxShadow: `0 0 5px ${borderColor}`,
                                        paddingTop: 0.5,
                                    }}
                                /> */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingBottom: 2,
                                        }}
                                    >
                                        <div>
                                            <BalanceBlockMod
                                                asset=''
                                                balance={''}
                                                prefix={''}
                                            />
                                        </div>
                                        <div>
                                            <BalanceBlockMod
                                                asset=''
                                                balance={''}
                                                suffix={''}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: '100%',
                                            paddingTop: '2%',
                                            textAlign: 'center',
                                            paddingBottom: 0,
                                        }}
                                    >
                                        {/* Start button here */}
                                        <div style={{ paddingTop: 2 }}>
                                            <NavLink
                                                component={Button}
                                                to='/qsg'
                                                {...{ external: true }}
                                            >
                                                Deposit QSG
                                            </NavLink>
                                        </div>
                                        <span style={{ opacity: 0.5 }}>
                                            {/* Unbond to make rewards claimable after your status is Unlocked */}
                                        </span>
                                    </div>
                                </TopBorderSectionMod>
                            }
                            action={''}
                        />
                    </Row>
                </SectionMod>

                <Section>
                    <IconHeader
                        icon={<i className='fas fa-chart-line' />}
                        text='Stats'
                    />
                </Section>
                <SectionMod>
                    <BRow>
                        {/* <BCol lg={4} md={12} sm={12}>
                            <Tile
                                style={{ height: '200px' }}
                                line1='Epoch'
                                line2={epochTime}
                                line3={`Advance -> ${curEpoch + 1}`}
                            />
                        </BCol> */}
                        <BCol lg={4} md={12} sm={12}>
                            <Tile
                                style={{ height: '200px' }}
                                line1='QSD Price'
                                line2={'$' + tokenPriceStr}
                                line3={''}
                            />
                        </BCol>
                        <BCol lg={4} md={12} sm={12}>
                            <Tile
                                style={{ height: '200px' }}
                                line1='Total Supply'
                                line2={
                                    totalSupply === null
                                        ? '...'
                                        : formatBN(totalSupply, 2)
                                }
                                line3={`${
                                    Number(epochTime.split('-')[0]) < 108
                                        ? 'Bootstrapping phase'
                                        : QSDPrice !== null &&
                                          QSDPrice?.toNumber() > 1.02
                                        ? 'Above Peg'
                                        : 'Idle phase'
                                }`}
                            />
                        </BCol>
                        <BCol lg={4} md={12} sm={12}>
                            <Tile
                                style={{ height: '200px' }}
                                line1='Market Cap'
                                line2={`${
                                    totalSupply !== null && QSDPrice !== null
                                        ? '$' +
                                          formatBN(
                                              totalSupply.multipliedBy(
                                                  QSDPrice
                                              ),
                                              2
                                          )
                                        : '...'
                                }`}
                                line3=''
                            />
                        </BCol>
                    </BRow>
                </SectionMod>

                <Section>
                    <Regulation user={user} hideHistory />
                    {/* <div style={{ textAlign: 'center', marginTop: 22 }}>
                        <NavLink
                            component={Button}
                            to='/regulation'
                            {...{ external: false }}
                        >
                            View more
                        </NavLink>
                    </div> */}
                </Section>
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
            {/*Commented By RDN*/}
            {/* </Layout> */}
        </BContainer>
    );
}

function Section(props: ComponentProps<'div'>) {
    return <div style={{ marginTop: 80 }} {...props} />;
}

function SectionMod(props: ComponentProps<'div'>) {
    return <div style={{ marginTop: 0 }} {...props} />;
}

export default HomePage;
