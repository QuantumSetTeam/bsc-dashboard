import { Button } from '@aragon/ui';
import React, { ComponentProps, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
//Commented By RDN
// import { Layout } from '@aragon/ui';
import { IconHeader, Row, Tile, TopBorderBox , BRow, BCol , BContainer } from '../common';
import Regulation from '../Regulation';
import { QSD, QSDS, DAI } from '../../constants/tokens';
import {
  getDaoIsBootstrapping,
  getExpansionAmount,
  getInstantaneousQSDPrice,
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
  const [QSDPrice, setQSDPrice] = useState<BigNumber | null>(null);
  const [QSDLiquidity, setQSDLiquidity] = useState<BigNumber | null>(null);
  const [daiLiquidity, setDAILiquidity] = useState<BigNumber | null>(null);

  const [daoBonded, setDaoBonded] = useState<BigNumber | null>(null);
  const [lpQSDLiquidity, setLpQSDLiquidity] = useState<number | null>(null);
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
        getTokenTotalSupply(QSD.addr),
        getInstantaneousQSDPrice(),
        getUniswapLiquidity(),
        getLPBondedLiquidity(),
        getExpansionAmount(),
        getDaoIsBootstrapping(),
        getTotalBonded(QSDS.addr),
        getPoolTotalBonded(poolBonding),
      ]);

      setTotalSupply(toTokenUnitsBN(supply, 18));
      setQSDPrice(toTokenUnitsBN(tokenPrice, 18));
      setQSDLiquidity(toTokenUnitsBN(liquidity.QSD, 18));
      setDAILiquidity(toTokenUnitsBN(liquidity.dai, 18));
      setLpQSDLiquidity(liquidityLp.QSD);
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
  if (QSDPrice && lpQSDLiquidity && lpDaiLiquidity && expansionAmount) {
    const totalDAI = lpQSDLiquidity * toFloat(QSDPrice) + lpDaiLiquidity;
    const daiToAdd = (expansionAmount / 2) * toFloat(QSDPrice);

    const lpYield = (daiToAdd / totalDAI) * 100;

    //lpHourlyYield = numberFormat.format(lpYield / 4) + '%';
    lpDailyYield = numberFormat.format(lpYield * 6) + '%';
    lpWeeklyYield = numberFormat.format(lpYield * 6 * 7) + '%';
    lpMonthlyYield = numberFormat.format(lpYield * 6 * 30) +'%';
  }

  // Calculate DAO APR (4 hrs)
  if (QSDPrice && daoBonded && expansionAmount) {
    const totalQSD = toFloat(daoBonded);
    const QSDToAdd = expansionAmount / 2;

    const daoYield = (QSDToAdd / totalQSD) * 100;

    //daoHourlyYield = numberFormat.format(daoYield / 4) + '%';
    daoDailyYield = numberFormat.format(daoYield * 6) + '%';
    daoWeeklyYield = numberFormat.format(daoYield * 6 * 7) + '%';
    daoMonthlyYield = numberFormat.format(daoYield * 6 * 30) + '%';
  }

  const curEpoch = Number(epochTime.split('-')[0]);

  console.log(QSDPrice?.toNumber);

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
                : QSDPrice !== null && QSDPrice?.toNumber() > 1.02
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
              totalSupply !== null && QSDPrice !== null
                ? '$' + formatBN(totalSupply.multipliedBy(QSDPrice), 2)
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
              title='QSD Price'
              body={QSDPrice ? formatBN(QSDPrice, 2) + ' DAI' : '...'}
              action={
                <Button>
                  <a
                    target='_blank'
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none' }}
                    href={`https://narwhalswap.org/#/page/swap?outputCurrency=${QSD.addr}`}
                  >
                    Trade QSD
                  </a>
                </Button>
              }
            />
            <TopBorderBox
              title='QSD in LP pool'
              body={QSDLiquidity ? formatBN(QSDLiquidity, 2) + ' QSD' : '...'}
              action={
                <Button>
                  <a
                    target='_blank'
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none' }}
                    href={`https://info.narwhalswap.org/token/${QSD.addr}`}
                  >
                    Trade Info
                  </a>
                </Button>
              }
            />
            <TopBorderBox
              title='QSD Liquidity'
              body={daiLiquidity ? formatBN(daiLiquidity, 2) + ' DAI' : '...'}
              action={
                <Button>
                  <a
                    target='_blank'
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none' }}
                    href={`https://narwhalswap.org/#/page/add/${QSD.addr}/${DAI.addr}`}
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
              title='Bonded QSD APR'
              body={
                <>
                  <div>QSD Daily: {daoDailyYield} </div>
                  <div>QSD Weekly: {daoWeeklyYield} </div>
                  <div>QSD Monthly: {daoMonthlyYield} </div>
                </>
              }
              action={
                <NavLink
                  component={Button}
                  to={curEpoch < 72 ? '/bootstrapping' : '/QSD'}
                  {...{ external: false }}
                >
                  Add QSD
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
