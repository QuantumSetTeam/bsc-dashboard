import React from 'react';

type BlanceBlockProps = {
    asset: string;
    balance: string | null;
    suffix?: string;
    prefix?: string;
};

function BalanceBlockMod({
    asset,
    balance,
    suffix = '',
    prefix = '',
}: BlanceBlockProps) {
    // if (typeof balance === BigNumber) {
    //     const balanceFormat = formatBN(balance, 2);
    // }

    // const balanceBN = new BigNumber(balance);
    // if (balanceBN.gte(new BigNumber(0))) {
    //     const tokens = formatBN(balanceBN, 2).split('.');
    //     integer = tokens[0];
    //     digits = tokens[1];
    // }

    return (
        <>
            <div style={{ fontSize: 14, padding: 3 }}>{asset}</div>
            <div style={{ padding: 3 }}>
                {prefix === '' ? (
                    ''
                ) : (
                    <span style={{ fontSize: 22 }}>{prefix}</span>
                )}
                <span style={{ fontSize: 24 }}>{balance}</span>
                {suffix === '' ? (
                    ''
                ) : (
                    <span style={{ fontSize: 22 }}>{suffix}</span>
                )}
            </div>
        </>
    );
}

export default BalanceBlockMod;
