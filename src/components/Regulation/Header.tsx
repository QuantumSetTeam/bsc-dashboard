import { Distribution } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import React from 'react';
import { formatMoney, ownership } from '../../utils/number';
import { Row, TopBorderBox } from '../common';

type RegulationHeaderProps = {
    totalSupply: BigNumber;

    daoBonded: BigNumber;
    daoStaged: BigNumber;

    poolLPLiquidity: BigNumber;
    poolLPRewarded: BigNumber;
    poolLPClaimable: BigNumber;
};

const RegulationHeader = ({
    totalSupply,
    daoBonded,
    daoStaged,
    poolLPLiquidity,
    poolLPRewarded,
    poolLPClaimable,
}: RegulationHeaderProps) => {
    const daoTotalSupply = daoBonded.plus(daoStaged);
    const poolTotalSupply = poolLPLiquidity
        .plus(poolLPRewarded)
        .plus(poolLPClaimable);
    const circulatingSupply = totalSupply
        .minus(daoTotalSupply)
        .minus(poolTotalSupply);

    return (
        <>
            <Row>
                <TopBorderBox
                    title='Supply Allocation'
                    body={
                        <Distribution
                            heading={`${formatMoney(totalSupply.toNumber())}`}
                            items={[
                                {
                                    item: 'Bonded',
                                    percentage: +ownership(
                                        daoTotalSupply,
                                        totalSupply
                                    )
                                        .toNumber()
                                        .toFixed(2),
                                },
                                {
                                    item: 'PancakeSwap',
                                    percentage: +ownership(
                                        poolTotalSupply,
                                        totalSupply
                                    )
                                        .toNumber()
                                        .toFixed(2),
                                },
                                {
                                    item: 'Circulating',
                                    percentage: +ownership(
                                        circulatingSupply,
                                        totalSupply
                                    )
                                        .toNumber()
                                        .toFixed(2),
                                },
                            ]}
                        />
                    }
                />

                <TopBorderBox
                    title='Bonded QSD Breakdown'
                    body={
                        <Distribution
                            heading={`${formatMoney(
                                daoTotalSupply.toNumber()
                            )}`}
                            items={[
                                {
                                    item: 'Bonded',
                                    percentage: +ownership(
                                        daoBonded,
                                        daoTotalSupply
                                    )
                                        .toNumber()
                                        .toFixed(2),
                                },
                                {
                                    item: 'Staged',
                                    percentage: +ownership(
                                        daoStaged,
                                        daoTotalSupply
                                    )
                                        .toNumber()
                                        .toFixed(2),
                                },
                            ]}
                        />
                    }
                />

                <TopBorderBox
                    title='Bonded LP Breakdown'
                    body={
                        <Distribution
                            heading={`${formatMoney(
                                poolTotalSupply.toNumber()
                            )}`}
                            items={[
                                {
                                    item: 'Liquidity',
                                    percentage: +ownership(
                                        poolLPLiquidity,
                                        poolTotalSupply
                                    )
                                        .toNumber()
                                        .toFixed(2),
                                },
                                {
                                    item: 'Rewarded',
                                    percentage: +ownership(
                                        poolLPRewarded,
                                        poolTotalSupply
                                    )
                                        .toNumber()
                                        .toFixed(2),
                                },
                                {
                                    item: 'Claimable',
                                    percentage: +ownership(
                                        poolLPClaimable,
                                        poolTotalSupply
                                    )
                                        .toNumber()
                                        .toFixed(2),
                                },
                            ]}
                        />
                    }
                />
            </Row>
        </>
    );
};

export default RegulationHeader;
