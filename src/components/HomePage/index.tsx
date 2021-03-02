import { Button } from '@aragon/ui';
import React, { ComponentProps, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
//Commented By RDN
// import { Layout } from '@aragon/ui';
import { IconHeader, Row, Tile, TopBorderBox , BRow, BCol , BContainer } from '../common';
import Regulation from '../Regulation';
import { SCD, SCDS } from '../../constants/tokens';
import {
  getDaoIsBootstrapping,
  getExpansionAmount,
  getInstantaneousSCDPrice,
  getLPBondedLiquidity,
  getPoolTotalBonded,
  getTokenTotalSupply,
  getTotalBonded,
  getUniswapLiquidity,
} from '../../utils/infura';
import { formatBN, toFloat, toTokenUnitsBN } from '../../utils/number';
import { epochformatted } from '../../utils/calculation';
import BigNumber from 'bignumber.js';
import { getPoolBondingAddress } from '../../utils/pool';

type HomePageProps = {
  user: string;
};

function HomePage({ user }: HomePageProps) {
  const [epochTime, setEpochTime] = useState('0-00:00:00');
  const [totalSupply, setTotalSupply] = useState<BigNumber | null>(null);
  const [SCDPrice, setSCDPrice] = useState<BigNumber | null>(null);
  const [SCDLiquidity, setSCDLiquidity] = useState<BigNumber | null>(null);
  const [daiLiquidity, setDAILiquidity] = useState<BigNumber | null>(null);

  const [daoBonded, setDaoBonded] = useState<BigNumber | null>(null);
  const [lpSCDLiquidity, setLpSCDLiquidity] = useState<number | null>(null);
  const [lpDaiLiquidity, setLpDaiLiquidity] = useState<number | null>(null);
  const [expansionAmount, setExpansionAmount] = useState<number | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function updateInfo() {
      const poolBonding = await getPoolBondingAddress();

      const [
        supply,
        tokenPrice,
        liquidity,
        liquidityLp,
        expansion,
        bootstrapping,
        daoBonded,
        bondingBonded,
      ] = await Promise.all([
        getTokenTotalSupply(SCD.addr),
        getInstantaneousSCDPrice(),
        getUniswapLiquidity(),
        getLPBondedLiquidity(),
        getExpansionAmount(),
        getDaoIsBootstrapping(),
        getTotalBonded(SCDS.addr),
        getPoolTotalBonded(poolBonding),
      ]);

      setTotalSupply(toTokenUnitsBN(supply, 18));
      setSCDPrice(toTokenUnitsBN(tokenPrice, 18));
      setSCDLiquidity(toTokenUnitsBN(liquidity.SCD, 18));
      setDAILiquidity(toTokenUnitsBN(liquidity.dai, 18));
      setLpSCDLiquidity(liquidityLp.SCD);
      setLpDaiLiquidity(liquidityLp.dai);
      setExpansionAmount(expansion);

      if (bootstrapping) {
        setDaoBonded(toTokenUnitsBN(daoBonded, 18));
      } else {
        setDaoBonded(toTokenUnitsBN(bondingBonded, 18));
      }
    }

    async function updateUserInfo() {
      if (!isCancelled) {
        setEpochTime(epochformatted());
      }
    }

    updateInfo();
    updateUserInfo();

    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  let daoWeeklyYield = '...';
  //let daoHourlyYield = '...';
  let daoDailyYield = '...';
  let daoMonthlyYield = '...';

  let lpWeeklyYield = '...';
  //let lpHourlyYield = '...';
  let lpDailyYield = '...';
  let lpMonthlyYield = '...';

  // Define number formatting
  var options = { minimumFractionDigits: 0,
                maximumFractionDigits: 2 };
  var numberFormat = new Intl.NumberFormat('en-US', options);

  // Calculate LP APR (4 hrs)
  if (SCDPrice && lpSCDLiquidity && lpDaiLiquidity && expansionAmount) {
    const totalDAI = lpSCDLiquidity * toFloat(SCDPrice) + lpDaiLiquidity;
    const daiToAdd = (expansionAmount / 2) * toFloat(SCDPrice);

    const lpYield = (daiToAdd / totalDAI) * 100;

    //lpHourlyYield = numberFormat.format(lpYield / 4) + '%';
    lpDailyYield = numberFormat.format(lpYield * 6) + '%';
    lpWeeklyYield = numberFormat.format(lpYield * 6 * 7) + '%';
    lpMonthlyYield = numberFormat.format(lpYield * 6 * 30) +'%';
  }

  // Calculate DAO APR (4 hrs)
  if (SCDPrice && daoBonded && expansionAmount) {
    const totalSCD = toFloat(daoBonded);
    const SCDToAdd = expansionAmount / 2;

    const daoYield = (SCDToAdd / totalSCD) * 100;

    //daoHourlyYield = numberFormat.format(daoYield / 4) + '%';
    daoDailyYield = numberFormat.format(daoYield * 6) + '%';
    daoWeeklyYield = numberFormat.format(daoYield * 6 * 7) + '%';
    daoMonthlyYield = numberFormat.format(daoYield * 6 * 30) + '%';
  }

  const curEpoch = Number(epochTime.split('-')[0]);

  return (
    <BContainer>
      {/*Commented By RDN*/}
    {/* <Layout> */}
      <div style={{ margin: '60px 0' }}>
        
        <BRow >
        <BCol  lg={4}  md={12} sm={12}  >
        <Tile
            style={{height : '200px'}}
            line1='Epoch'
            line2={epochTime}
            line3={`Advance -> ${curEpoch + 1}`}
          />
        </BCol>
         <BCol   lg={4}  md={12} sm={12}>
         <Tile
            style={{height : '200px'}}
            line1='Total Supply'
            line2={totalSupply === null ? '...' : formatBN(totalSupply, 2)}
            line3={`${
              Number(epochTime.split('-')[0]) < 108
                ? 'Bootstrapping phase'
                : SCDPrice?.isGreaterThan(
                    new BigNumber(10).pow(new BigNumber(18))
                  )
                ? 'Above Peg'
                : 'Idle phase'
            }`}
          />
         </BCol>
         <BCol   lg={4}  md={12} sm={12}>
         <Tile
            style={{height : '200px'}}
            line1='Market Cap'
            line2={`${
              totalSupply !== null && SCDPrice !== null
                ? '$' + formatBN(totalSupply.multipliedBy(SCDPrice), 2)
                : '...'
            }`}
            line3=''
          />
         </BCol>
          
        </BRow>
        {/* </BContainer> */}

        <Section>
          <IconHeader
            icon={<i className='fas fa-exchange-alt' />}
            text='Trade'
          />
          <Row>
            <TopBorderBox
              title='SCD Price'
              body={SCDPrice ? formatBN(SCDPrice, 2) + ' DAI' : '...'}
              action={
                <Button>
                  <a
                    target='_blank'
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none' }}
                    href={`https://app.uniswap.org/#/swap?outputCurrency=${SCD.addr}`}
                  >
                    Trade SCD
                  </a>
                </Button>
              }
            />
            <TopBorderBox
              title='SCD in LP pool'
              body={SCDLiquidity ? formatBN(SCDLiquidity, 2) + ' SCD' : '...'}
              action={
                <Button>
                  <a
                    target='_blank'
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none' }}
                    href={`https://info.uniswap.org/token/${SCD.addr}`}
                  >
                    Trade Info
                  </a>
                </Button>
              }
            />
            <TopBorderBox
              title='SCD Liquidity'
              body={daiLiquidity ? formatBN(daiLiquidity, 2) + ' DAI' : '...'}
              action={
                <Button>
                  <a
                    target='_blank'
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none' }}
                    href={`https://app.uniswap.org/#/add/${SCD.addr}/0x6b175474e89094c44da98b954eedeac495271d0f`}
                  >
                    Add Liquidity
                  </a>
                </Button>
              }
            />
          </Row>
        </Section>

        <Section>
          <IconHeader
            icon={<i className='fas fa-chart-line' />}
            text='Invest'
          />
          <Row>
            <TopBorderBox
              title='Bonded SCD APR'
              body={
                <>
                  <div>SCD Daily: {daoDailyYield} </div>
                  <div>SCD Weekly: {daoWeeklyYield} </div>
                  <div>SCD Monthly: {daoMonthlyYield} </div>
                </>
              }
              action={
                <NavLink
                  component={Button}
                  to={curEpoch < 72 ? '/bootstrapping' : '/SCD'}
                  {...{ external: false }}
                >
                  Add SCD
                </NavLink>
              }
            />
            <TopBorderBox
              title='Bonded LP APR'
              body={
                <>
                  <div>LP Daily: {lpDailyYield} </div>
                  <div>LP Weekly: {lpWeeklyYield} </div>
                  <div>LP Monthly: {lpMonthlyYield} </div>
                </>
              }
              action={
                <NavLink component={Button} to='/lp' {...{ external: false }}>
                  Add LP
                </NavLink>
              }
            />
          </Row>
        </Section>

        <Section>
          <Regulation user={user} hideHistory />
          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <NavLink
              component={Button}
              to='/regulation'
              {...{ external: false }}
            >
              View more
            </NavLink>
          </div>
        </Section>
      </div>
      {/*Commented By RDN*/}
      {/* </Layout> */}
      </BContainer>
      
  );
}

function Section(props: ComponentProps<'div'>) {
  return <div style={{ marginTop: 80 }} {...props} />;
}

export default HomePage;
