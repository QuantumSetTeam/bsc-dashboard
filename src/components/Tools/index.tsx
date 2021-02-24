import { Button, Layout, useTheme } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PoolBonding, TreasuryAddress } from '../../constants/contracts';
import { QSD, QSDS, UNI } from '../../constants/tokens';
import { epochformattedRemaining } from '../../utils/calculation';
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getDaoIsBootstrapping,
  getEpoch,
  getExpansionAmount,
  getInstantaneousQSDPrice,
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
  const [qsdPrice, setQSDPrice] = useState<BigNumber | null>(null);
  const [twapPrice, setTwapPrice] = useState<null | number>(null);
  const [expansionAmount, setExpansionAmount] = useState<null | number>(null);

  const [treasuryQSDAmount, setTreasuryQSDAmount] = useState<null | BigNumber>(
    null
  );

  const [qsdBondedLiquidity, setQSDBondedLiquidity] = useState<number | null>(
    null
  );
  const [daiBondedLiquidity, setDAIBondedLiquidity] = useState<number | null>(
    null
  );

  const [qsdStagedLiquidity, setQSDStagedLiquidity] = useState<number | null>(
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
  const [userQsdBal, setUserQsdBal] = useState<BigNumber | null>(null);
  const [userUniBal, setUserUniBal] = useState<BigNumber | null>(null);

  const [userQsdWalletLiquidity, setUserQSDWalletLiquidity] = useState<
    number | null
  >(null);
  const [userDaiWalletLiquidity, setUserDAIWalletLiquidity] = useState<
    number | null
  >(null);

  const [userQsdBondedLiquidity, setUserQSDBondedLiquidity] = useState<
    number | null
  >(null);
  const [userDaiBondedLiquidity, setUserDAIBondedLiquidity] = useState<
    number | null
  >(null);

  const [userQsdStagedLiquidity, setUserQSDStagedLiquidity] = useState<
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
        treasuryQSD,
      ] = await Promise.all([
        getInstantaneousQSDPrice(),
        getTWAPPrice(),
        getTokenTotalSupply(QSD.addr),
        getLPBondedLiquidity(),
        getLPStagedLiquidity(),
        getPoolTotalBonded(poolLP),
        getPoolTotalStaged(poolLP),
        getTotalBonded(QSDS.addr),
        getTotalStaged(QSDS.addr),
        getPoolTotalBonded(poolBonding),
        getPoolTotalStaged(poolBonding),
        getExpansionAmount(),
        getDaoIsBootstrapping(),
        getEpoch(QSDS.addr),
        getTokenBalance(QSD.addr, TreasuryAddress),
      ]);

      setTwapPrice(twap);
      setTotalSupply(toTokenUnitsBN(supply, 18));
      setQSDPrice(toTokenUnitsBN(spot, 18));
      setQSDStagedLiquidity(stagedLiquidity.qsd);
      setDAIStagedLiquidity(stagedLiquidity.dai);
      setQSDBondedLiquidity(bondedLiquidity.qsd);
      setDAIBondedLiquidity(bondedLiquidity.dai);
      setLPBonded(toTokenUnitsBN(lpBonded, 18));
      setLPStaged(toTokenUnitsBN(lpStaged, 18));
      setDaoEpoch(parseInt(daoE, 10));
      setTreasuryQSDAmount(toTokenUnitsBN(treasuryQSD, QSD.decimals));

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
        userQSDBal,
        userUniBal,
        userLpBonded,
        userLpStaged,
        userDaoBonded,
        userDaoStaged,
        walletLiquidity,
        stagedLiquidity,
        bondedLiquidity,
      ] = await Promise.all([
        getTokenBalance(QSD.addr, user),
        getTokenBalance(UNI.addr, user),
        getPoolBalanceOfBonded(poolLP, user),
        getPoolBalanceOfStaged(poolLP, user),
        getBalanceBonded(PoolBonding, user),
        getBalanceOfStaged(PoolBonding, user),
        getUserLPWallet(user),
        getUserLPStaged(user),
        getUserLPBonded(user),
      ]);

      setUserQsdBal(toTokenUnitsBN(userQSDBal, 18));
      setUserUniBal(toTokenUnitsBN(userUniBal, 18));
      setUserLpBonded(toTokenUnitsBN(userLpBonded, 18));
      setUserLpStaged(toTokenUnitsBN(userLpStaged, 18));
      setUserDaoBonded(toTokenUnitsBN(userDaoBonded, 18));
      setUserDaoStaged(toTokenUnitsBN(userDaoStaged, 18));

      setUserQSDWalletLiquidity(walletLiquidity.qsd);
      setUserDAIWalletLiquidity(walletLiquidity.dai);

      setUserQSDStagedLiquidity(stagedLiquidity.qsd);
      setUserDAIStagedLiquidity(stagedLiquidity.dai);

      setUserQSDBondedLiquidity(bondedLiquidity.qsd);
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
  let qsdMarketCap = '...';
  let daoAPR = '...';
  let daoExpansionYield = '...';
  let lpExpansionYield = '...';
  let lpAPR = '...';

  let qsdBondedPrice = '$...';
  let qsdStagedPrice = '$...';
  let lpBondedPrice = '$...';
  let lpStagedPrice = '$...';

  let userQSDWalletPrice = '$0';
  let userQSDBondedPrice = '$0';
  let userQSDStagedPrice = '$0';

  let userLPWalletPrice = '$0';
  let userLPBondedPrice = '$0';
  let userLPStagedPrice = '$0';

  let treasuryUSDValue = '$0';

  // Define number formatting
  var options = { minimumFractionDigits: 0,
                maximumFractionDigits: 2 };
  var numberFormat = new Intl.NumberFormat('en-US', options);

  // Calculate prices
  if (qsdPrice && treasuryQSDAmount) {
    const totalDAI = toFloat(treasuryQSDAmount) * toFloat(qsdPrice);

    treasuryUSDValue = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && qsdStagedLiquidity && daiStagedLiquidity) {
    const totalDAI =
      qsdStagedLiquidity * toFloat(qsdPrice) + daiStagedLiquidity;
    lpStagedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && qsdBondedLiquidity && daiBondedLiquidity) {
    const totalDAI =
      qsdBondedLiquidity * toFloat(qsdPrice) + daiBondedLiquidity;
    lpBondedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && daoBonded) {
    const totalDAI = toFloat(daoBonded) * toFloat(qsdPrice);
    qsdBondedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && daoStaged) {
    const totalDAI = toFloat(daoStaged) * toFloat(qsdPrice);
    qsdStagedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && userQsdWalletLiquidity && userDaiWalletLiquidity) {
    const totalDAI =
      userQsdWalletLiquidity * toFloat(qsdPrice) + userDaiWalletLiquidity;

    userLPWalletPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && userQsdStagedLiquidity && userDaiStagedLiquidity) {
    const totalDAI =
      userQsdStagedLiquidity * toFloat(qsdPrice) + userDaiStagedLiquidity;

    userLPStagedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && userQsdBondedLiquidity && userDaiBondedLiquidity) {
    const totalDAI =
      userQsdBondedLiquidity * toFloat(qsdPrice) + userDaiBondedLiquidity;

    userLPBondedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && userQsdBal) {
    const totalDAI = toFloat(userQsdBal) * toFloat(qsdPrice);

    userQSDWalletPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && userDaoBonded) {
    const totalDAI = toFloat(userDaoBonded) * toFloat(qsdPrice);

    userQSDBondedPrice = '$' + numberFormat.format(totalDAI);
  }

  if (qsdPrice && userDaoStaged) {
    const totalDAI = toFloat(userDaoStaged) * toFloat(qsdPrice);

    userQSDStagedPrice = '$' + numberFormat.format(totalDAI);
  }

  // Calculate LP APR (4 hrs)
  if (qsdPrice && qsdBondedLiquidity && daiBondedLiquidity && expansionAmount) {
    const totalDAI =
      qsdBondedLiquidity * toFloat(qsdPrice) + daiBondedLiquidity;
    const daiToAdd = (expansionAmount / 2) * toFloat(qsdPrice);

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
  if (qsdPrice && daoBonded && expansionAmount) {
    const totalQSD = toFloat(daoBonded);
    const qsdToAdd = expansionAmount / 2;

    const daoYield = (qsdToAdd / totalQSD) * 100;

    daoExpansionYield = Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(daoYield) + '%';
    daoAPR = Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(daoYield * 6 * 365) + '%';
  }

  if (qsdPrice && qsdBondedLiquidity)
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

  if (qsdPrice && totalSupply) {
    
    let qsdMarketCapNumber = 0;
    
    qsdMarketCapNumber = toFloat(qsdPrice) * toFloat(totalSupply);

    qsdMarketCap = numberFormat.format(qsdMarketCapNumber);

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
                )} QSD`
              : 'No expansion rewards this epoch'
          }
          line3={
            expansionAmount && expansionAmount > 0
              ? `Yielding ${lpExpansionYield} on LP TVL (${lpAPR} APR) and ${daoExpansionYield} to Bonded QSD (${daoAPR} APR)`
              : 'QSG will be allocated to QSD stakers'
          }
        />
      </Section>
      <BorderedSection>
        <Row>
          <InfoBox title='Epoch (Real-time)'>{estimatedEpoch}</InfoBox>
          <InfoBox title='Epoch (Dao)'>{daoEpoch}</InfoBox>
          <InfoBox title='Next Epoch'>{nextEpochIn}</InfoBox>
          <InfoBox title='Treasury'>
            {treasuryQSDAmount
              ? formatBN(treasuryQSDAmount, 2) + ' QSD'
              : '... QSD'}{' '}
            ({treasuryUSDValue})
          </InfoBox>
        </Row>
      </BorderedSection>
      <BorderedSection>
        <Row>
          <InfoBox title='LP Yield'>{lpExpansionYield}</InfoBox>
          <InfoBox title='LP APR'>{lpAPR}</InfoBox>
          <InfoBox title='QSD Yield'>{daoExpansionYield}</InfoBox>
          <InfoBox title='QSD APR'>{daoAPR}</InfoBox>
        </Row>
      </BorderedSection>
      <BorderedSection>
        <Row>
          <InfoBox title='Spot Price'>
            {qsdPrice ? '$' + formatBN(qsdPrice, 2) : '...'}
          </InfoBox>
          <InfoBox title='TWAP Price'>
            {twapPrice ? '$' + twapPrice.toFixed(2) : '...'}
          </InfoBox>
          <InfoBox title='Total Supply'>
            {totalSupply
              ? numberFormat.format(toFloat(totalSupply)) + ' QSD'
              : '...'}
          </InfoBox>

          <InfoBox title='Market Cap'>${qsdMarketCap}</InfoBox>
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
          <InfoBox title='QSD Bonded'>
            {daoBondedPercentage} ({qsdBondedPrice})
          </InfoBox>
          <InfoBox title='QSD Staged'>
            {daoStagedPercentage} ({qsdStagedPrice})
          </InfoBox>
        </Row>
      </Section>
      <TopBorderSection title='User'>
        <BorderedSection>
          <Row>
            <InfoBox title='QSD Wallet'>
              {userQsdBal ? formatBN(userQsdBal, 2) + ' QSD' : '0'} (
              {userQSDWalletPrice})
            </InfoBox>
            <InfoBox title='QSD Staged'>
              {userDaoStaged ? formatBN(userDaoStaged, 2) + ' QSD' : '0'} (
              {userQSDStagedPrice})
            </InfoBox>
            <InfoBox title='QSD Bonded'>
              {userDaoBonded ? formatBN(userDaoBonded, 2) + ' QSD' : '0'} (
              {userQSDBondedPrice})
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
                advance(QSDS.addr);
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
