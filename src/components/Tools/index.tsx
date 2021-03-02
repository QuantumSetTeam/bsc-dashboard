import { Button, Layout, useTheme } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PoolBonding, TreasuryAddress } from '../../constants/contracts';
import { SCD, SCDS, UNI } from '../../constants/tokens';
import { epochformattedRemaining } from '../../utils/calculation';
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getDaoIsBootstrapping,
  getEpoch,
  getExpansionAmount,
  getInstantaneousSCDPrice,
  getLPBondedLiquidity,
  getLPStagedLiquidity,
  getPoolBalanceOfBonded,
  getPoolBalanceOfStaged,
  getPoolTotalBonded,
  getPoolTotalStaged,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBonded,
  getTotalStaged,
  getTWAPPrice,
  getUserLPBonded,
  getUserLPStaged,
  getUserLPWallet,
} from '../../utils/infura';
import { formatBN, toTokenUnitsBN } from '../../utils/number';
import { getPoolBondingAddress, getPoolLPAddress } from '../../utils/pool';
import { advance } from '../../utils/web3';
import { Row, Section, Tile, TopBorderSection } from '../common';
import { SectionProps } from '../common/Section';

function Tools({ user }: { user: string }) {
  const theme = useTheme();

  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [daoEpoch, setDaoEpoch] = useState(0);
  const [estimatedEpoch, setEstimatedEpoch] = useState(0);
  const [nextEpochIn, setNextEpochIn] = useState('00:00:00');
  const [totalSupply, setTotalSupply] = useState<BigNumber | null>(null);
  const [SCDPrice, setSCDPrice] = useState<BigNumber | null>(null);
  const [twapPrice, setTwapPrice] = useState<null | number>(null);
  const [expansionAmount, setExpansionAmount] = useState<null | number>(null);

  const [treasurySCDAmount, setTreasurySCDAmount] = useState<null | BigNumber>(
    null
  );

  const [SCDBondedLiquidity, setSCDBondedLiquidity] = useState<number | null>(
    null
  );
  const [daiBondedLiquidity, setDAIBondedLiquidity] = useState<number | null>(
    null
  );

  const [SCDStagedLiquidity, setSCDStagedLiquidity] = useState<number | null>(
    null
  );
  const [daiStagedLiquidity, setDAIStagedLiquidity] = useState<number | null>(
    null
  );

  const [daoBonded, setDaoBonded] = useState<BigNumber | null>(null);
  const [daoStaged, setDaoStaged] = useState<BigNumber | null>(null);
  const [lpBonded, setLPBonded] = useState<BigNumber | null>(null);
  const [lpStaged, setLPStaged] = useState<BigNumber | null>(null);
  const [userLpBonded, setUserLpBonded] = useState<BigNumber | null>(null);
  const [userLpStaged, setUserLpStaged] = useState<BigNumber | null>(null);
  const [userDaoBonded, setUserDaoBonded] = useState<BigNumber | null>(null);
  const [userDaoStaged, setUserDaoStaged] = useState<BigNumber | null>(null);
  const [userSCDBal, setUserSCDBal] = useState<BigNumber | null>(null);
  const [userUniBal, setUserUniBal] = useState<BigNumber | null>(null);

  const [userSCDWalletLiquidity, setUserSCDWalletLiquidity] = useState<
    number | null
  >(null);
  const [userDaiWalletLiquidity, setUserDAIWalletLiquidity] = useState<
    number | null
  >(null);

  const [userSCDBondedLiquidity, setUserSCDBondedLiquidity] = useState<
    number | null
  >(null);
  const [userDaiBondedLiquidity, setUserDAIBondedLiquidity] = useState<
    number | null
  >(null);

  const [userSCDStagedLiquidity, setUserSCDStagedLiquidity] = useState<
    number | null
  >(null);
  const [userDaiStagedLiquidity, setUserDAIStagedLiquidity] = useState<
    number | null
  >(null);

  useEffect(() => {
    const f = async () => {
      const poolLP = await getPoolLPAddress();
      const poolBonding = await getPoolBondingAddress();

      const [
        spot,
        twap,
        supply,
        bondedLiquidity,
        stagedLiquidity,
        lpBonded,
        lpStaged,
        daoBonded,
        daoStaged,
        bondingBonded,
        bondingStaged,
        expansionAmount,
        bootstrapping,
        daoE,
        treasurySCD,
      ] = await Promise.all([
        getInstantaneousSCDPrice(),
        getTWAPPrice(),
        getTokenTotalSupply(SCD.addr),
        getLPBondedLiquidity(),
        getLPStagedLiquidity(),
        getPoolTotalBonded(poolLP),
        getPoolTotalStaged(poolLP),
        getTotalBonded(SCDS.addr),
        getTotalStaged(SCDS.addr),
        getPoolTotalBonded(poolBonding),
        getPoolTotalStaged(poolBonding),
        getExpansionAmount(),
        getDaoIsBootstrapping(),
        getEpoch(SCDS.addr),
        getTokenBalance(SCD.addr, TreasuryAddress),
      ]);

      setTwapPrice(twap);
      setTotalSupply(toTokenUnitsBN(supply, 18));
      setSCDPrice(toTokenUnitsBN(spot, 18));
      setSCDStagedLiquidity(stagedLiquidity.SCD);
      setDAIStagedLiquidity(stagedLiquidity.dai);
      setSCDBondedLiquidity(bondedLiquidity.SCD);
      setDAIBondedLiquidity(bondedLiquidity.dai);
      setLPBonded(toTokenUnitsBN(lpBonded, 18));
      setLPStaged(toTokenUnitsBN(lpStaged, 18));
      setDaoEpoch(parseInt(daoE, 10));
      setTreasurySCDAmount(toTokenUnitsBN(treasurySCD, SCD.decimals));

      // If is bootstrapping, then bonding will be referencing dao
      // otherwise it'll be referencing bonding
      if (bootstrapping) {
        setDaoBonded(toTokenUnitsBN(daoBonded, 18));
        setDaoStaged(toTokenUnitsBN(daoStaged, 18));
      } else {
        setDaoBonded(toTokenUnitsBN(bondingBonded, 18));
        setDaoStaged(toTokenUnitsBN(bondingStaged, 18));
      }

      setExpansionAmount(expansionAmount);
    };

    const g = async () => {
      if (!user) return;

      const poolLP = await getPoolLPAddress();

      const [
        userSCDBal,
        userUniBal,
        userLpBonded,
        userLpStaged,
        userDaoBonded,
        userDaoStaged,
        walletLiquidity,
        stagedLiquidity,
        bondedLiquidity,
      ] = await Promise.all([
        getTokenBalance(SCD.addr, user),
        getTokenBalance(UNI.addr, user),
        getPoolBalanceOfBonded(poolLP, user),
        getPoolBalanceOfStaged(poolLP, user),
        getBalanceBonded(PoolBonding, user),
        getBalanceOfStaged(PoolBonding, user),
        getUserLPWallet(user),
        getUserLPStaged(user),
        getUserLPBonded(user),
      ]);

      setUserSCDBal(toTokenUnitsBN(userSCDBal, 18));
      setUserUniBal(toTokenUnitsBN(userUniBal, 18));
      setUserLpBonded(toTokenUnitsBN(userLpBonded, 18));
      setUserLpStaged(toTokenUnitsBN(userLpStaged, 18));
      setUserDaoBonded(toTokenUnitsBN(userDaoBonded, 18));
      setUserDaoStaged(toTokenUnitsBN(userDaoStaged, 18));

      setUserSCDWalletLiquidity(walletLiquidity.SCD);
      setUserDAIWalletLiquidity(walletLiquidity.dai);

      setUserSCDStagedLiquidity(stagedLiquidity.SCD);
      setUserDAIStagedLiquidity(stagedLiquidity.dai);

      setUserSCDBondedLiquidity(bondedLiquidity.SCD);
      setUserDAIBondedLiquidity(bondedLiquidity.dai);
    };

    async function updateEpoch() {
      const e = epochformattedRemaining();

      setEstimatedEpoch(parseInt(e.split('-')[0], 10));
      setNextEpochIn(e.split('-')[1]);
    }

    setInterval(updateEpoch, 1000);

    f();
    g();
  }, [user]);

  const toFloat = (a: BigNumber): number => {
    return parseFloat(formatBN(a, 2).split(',').join(''));
  };

  let lpBondedPercentage = '...';
  let lpStagedPercentage = '...';
  let daoBondedPercentage = '...';
  let daoStagedPercentage = '...';
  let SCDMarketCap = '...';
  let daoAPR = '...';
  let daoExpansionYield = '...';
  let lpExpansionYield = '...';
  let lpAPR = '...';

  let SCDBondedPrice = '$...';
  let SCDStagedPrice = '$...';
  let lpBondedPrice = '$...';
  let lpStagedPrice = '$...';

  let userSCDWalletPrice = '$0';
  let userSCDBondedPrice = '$0';
  let userSCDStagedPrice = '$0';

  let userLPWalletPrice = '$0';
  let userLPBondedPrice = '$0';
  let userLPStagedPrice = '$0';

  let treasuryUSDValue = '$0';

  // Define number formatting
  var options = { minimumFractionDigits: 0,
                maximumFractionDigits: 2 };
  var numberFormat = new Intl.NumberFormat('en-US', options);

  // Calculate prices
  if (SCDPrice && treasurySCDAmount) {
    const totalDAI = toFloat(treasurySCDAmount) * toFloat(SCDPrice);

    treasuryUSDValue = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && SCDStagedLiquidity && daiStagedLiquidity) {
    const totalDAI =
      SCDStagedLiquidity * toFloat(SCDPrice) + daiStagedLiquidity;
    lpStagedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && SCDBondedLiquidity && daiBondedLiquidity) {
    const totalDAI =
      SCDBondedLiquidity * toFloat(SCDPrice) + daiBondedLiquidity;
    lpBondedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && daoBonded) {
    const totalDAI = toFloat(daoBonded) * toFloat(SCDPrice);
    SCDBondedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && daoStaged) {
    const totalDAI = toFloat(daoStaged) * toFloat(SCDPrice);
    SCDStagedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && userSCDWalletLiquidity && userDaiWalletLiquidity) {
    const totalDAI =
      userSCDWalletLiquidity * toFloat(SCDPrice) + userDaiWalletLiquidity;

    userLPWalletPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && userSCDStagedLiquidity && userDaiStagedLiquidity) {
    const totalDAI =
      userSCDStagedLiquidity * toFloat(SCDPrice) + userDaiStagedLiquidity;

    userLPStagedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && userSCDBondedLiquidity && userDaiBondedLiquidity) {
    const totalDAI =
      userSCDBondedLiquidity * toFloat(SCDPrice) + userDaiBondedLiquidity;

    userLPBondedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && userSCDBal) {
    const totalDAI = toFloat(userSCDBal) * toFloat(SCDPrice);

    userSCDWalletPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && userDaoBonded) {
    const totalDAI = toFloat(userDaoBonded) * toFloat(SCDPrice);

    userSCDBondedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (SCDPrice && userDaoStaged) {
    const totalDAI = toFloat(userDaoStaged) * toFloat(SCDPrice);

    userSCDStagedPrice = '$' + numberFormat.format(totalDAI);
  }

  // Calculate LP APR (4 hrs)
  if (SCDPrice && SCDBondedLiquidity && daiBondedLiquidity && expansionAmount) {
    const totalDAI =
      SCDBondedLiquidity * toFloat(SCDPrice) + daiBondedLiquidity;
    const daiToAdd = (expansionAmount / 2) * toFloat(SCDPrice);

    const lpYield = (daiToAdd / totalDAI) * 100;

    lpExpansionYield =
      Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(lpYield) + '%';
    lpAPR = Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(lpYield * 6 * 365) + '%';
  }

  // Calculate DAO APR (4 hrs)
  if (SCDPrice && daoBonded && expansionAmount) {
    const totalSCD = toFloat(daoBonded);
    const SCDToAdd = expansionAmount / 2;

    const daoYield = (SCDToAdd / totalSCD) * 100;

    daoExpansionYield = Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(daoYield) + '%';
    daoAPR = Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(daoYield * 6 * 365) + '%';
  }

  if (SCDPrice && SCDBondedLiquidity)
    if (lpBonded && lpStaged) {
      const lpBondedF = toFloat(lpBonded);
      const lpStagedF = toFloat(lpStaged);

      const total = lpBondedF + lpStagedF;

      if (total > 0) {
        lpBondedPercentage = ((lpBondedF / total) * 100).toFixed(2) + '%';
        lpStagedPercentage = ((lpStagedF / total) * 100).toFixed(2) + '%';
      }
    }

  if (daoBonded && daoStaged) {
    const daoBondedF = toFloat(daoBonded);
    const daoStagedF = toFloat(daoStaged);

    const total = daoBondedF + daoStagedF;

    if (total > 0) {
      daoBondedPercentage = ((daoBondedF / total) * 100).toFixed(2) + '%';
      daoStagedPercentage = ((daoStagedF / total) * 100).toFixed(2) + '%';
    }
  }

  if (SCDPrice && totalSupply) {
    
    let SCDMarketCapNumber = 0;
    
    SCDMarketCapNumber = toFloat(SCDPrice) * toFloat(totalSupply);

    SCDMarketCap = numberFormat.format(SCDMarketCapNumber);

  }

  const BorderedSection: React.FC<SectionProps> = (props) => (
    <Section
      style={{
        borderBottom: `1px solid ${theme.border}`,
        paddingBottom: 56,
        marginBottom: -24,
      }}
      {...props}
    />
  );

  return (
    <Layout>
      <Section>
        <Tile
          line1='Next Epoch:'
          line2={
            expansionAmount && expansionAmount > 0
              ? `Total supply will increase by ${expansionAmount.toFixed(
                  2
                )} SCD`
              : 'No expansion rewards this epoch'
          }
          line3={
            expansionAmount && expansionAmount > 0
              ? `Yielding ${lpExpansionYield} on LP TVL (${lpAPR} APR) and ${daoExpansionYield} to Bonded SCD (${daoAPR} APR)`
              : 'SCDG will be allocated to SCD stakers'
          }
        />
      </Section>
      <BorderedSection>
        <Row>
          <InfoBox title='Epoch (Real-time)'>{estimatedEpoch}</InfoBox>
          <InfoBox title='Epoch (Dao)'>{daoEpoch}</InfoBox>
          <InfoBox title='Next Epoch'>{nextEpochIn}</InfoBox>
          <InfoBox title='Treasury'>
            {treasurySCDAmount
              ? formatBN(treasurySCDAmount, 2) + ' SCD'
              : '... SCD'}{' '}
            ({treasuryUSDValue})
          </InfoBox>
        </Row>
      </BorderedSection>
      <BorderedSection>
        <Row>
          <InfoBox title='LP Yield'>{lpExpansionYield}</InfoBox>
          <InfoBox title='LP APR'>{lpAPR}</InfoBox>
          <InfoBox title='SCD Yield'>{daoExpansionYield}</InfoBox>
          <InfoBox title='SCD APR'>{daoAPR}</InfoBox>
        </Row>
      </BorderedSection>
      <BorderedSection>
        <Row>
          <InfoBox title='Spot Price'>
            {SCDPrice ? '$' + formatBN(SCDPrice, 2) : '...'}
          </InfoBox>
          <InfoBox title='TWAP Price'>
            {twapPrice ? '$' + twapPrice.toFixed(2) : '...'}
          </InfoBox>
          <InfoBox title='Total Supply'>
            {totalSupply
              ? numberFormat.format(toFloat(totalSupply)) + ' SCD'
              : '...'}
          </InfoBox>

          <InfoBox title='Market Cap'>${SCDMarketCap}</InfoBox>
        </Row>
      </BorderedSection>
      <Section>
        <Row>
          <InfoBox title='LP Bonded'>
            {lpBondedPercentage} ({lpBondedPrice})
          </InfoBox>
          <InfoBox title='LP Staged'>
            {lpStagedPercentage} ({lpStagedPrice})
          </InfoBox>
          <InfoBox title='SCD Bonded'>
            {daoBondedPercentage} ({SCDBondedPrice})
          </InfoBox>
          <InfoBox title='SCD Staged'>
            {daoStagedPercentage} ({SCDStagedPrice})
          </InfoBox>
        </Row>
      </Section>
      <TopBorderSection title='User'>
        <BorderedSection>
          <Row>
            <InfoBox title='SCD Wallet'>
              {userSCDBal ? formatBN(userSCDBal, 2) + ' SCD' : '0'} (
              {userSCDWalletPrice})
            </InfoBox>
            <InfoBox title='SCD Staged'>
              {userDaoStaged ? formatBN(userDaoStaged, 2) + ' SCD' : '0'} (
              {userSCDStagedPrice})
            </InfoBox>
            <InfoBox title='SCD Bonded'>
              {userDaoBonded ? formatBN(userDaoBonded, 2) + ' SCD' : '0'} (
              {userSCDBondedPrice})
            </InfoBox>
          </Row>
        </BorderedSection>
        <Section>
          <Row>
            <InfoBox title='UNI-V2 Wallet'>
              {userUniBal ? formatBN(userUniBal, 2) + ' UNI' : '0'} (
              {userLPWalletPrice})
            </InfoBox>
            <InfoBox title='LP Staged'>
              {userLpStaged ? formatBN(userLpStaged, 2) + ' UNI' : '0'} (
              {userLPStagedPrice})
            </InfoBox>
            <InfoBox title='LP Bonded'>
              {userLpBonded ? formatBN(userLpBonded, 2) + ' UNI' : '0'} (
              {userLPBondedPrice})
            </InfoBox>
          </Row>
        </Section>
        <Section>
          <Row>
            <Button
              onClick={() => {
                advance(SCDS.addr);
              }}
              disabled={!user && daoEpoch < estimatedEpoch}
            >
              Advance Epoch
            </Button>
          </Row>
        </Section>
      </TopBorderSection>
    </Layout>
  );
}

export default Tools;

interface InfoBoxProps extends React.ComponentProps<'div'> {
  title: string;
}
const InfoBox: React.FC<InfoBoxProps> = ({ title, children }) => (
  <div>
    <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }}>{title}</div>
    <div style={{ fontSize: 20 }}>{children}</div>
  </div>
);
