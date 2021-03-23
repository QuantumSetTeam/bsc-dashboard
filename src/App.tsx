import React, { useEffect, useState } from 'react';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Main } from '@aragon/ui';
import { UseWalletProvider } from 'use-wallet';
import { updateModalMode } from './utils/web3';
import { storePreference, getPreference } from './utils/storage';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Trade from './components/Trade/index';
import Footer from './components/Footer';
import ClaimBSC from './components/ClaimBSC';
import EpochDetail from './components/EpochDetail';
import CouponMarket from './components/CouponMarket';
import Governance from './components/Governance';
import Candidate from './components/Candidate';
import Regulation from './components/Regulation';
import Pool from './components/Pool';
import PoolGov from './components/PoolGov';
import Bonding from './components/Bonding';
import HomePageNoWeb3 from './components/HomePageNoWeb3';
import { Landing } from './components/Landing';
import { themes } from './utils/theme';
import Tools from './components/Tools';

function App() {
    const storedTheme = getPreference('theme', 'dark');

    const [hasWeb3, setHasWeb3] = useState(false);
    const [user, setUser] = useState(''); // the current connected user
    const [theme, setTheme] = useState(storedTheme);

    const updateTheme = (newTheme: string) => {
        setTheme(newTheme);
        updateModalMode(newTheme);
        storePreference('theme', newTheme);
    };

    useEffect(() => {
        let isCancelled = false;

        async function updateUserInfo() {
            if (!isCancelled) {
                // @ts-ignore
                setHasWeb3(typeof window.ethereum !== 'undefined');
            }
        }

        updateUserInfo();
        const id = setInterval(updateUserInfo, 15000);

        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true;
            clearInterval(id);
        };
    }, [user]);

    return (
        <Router>
            <UseWalletProvider
                chainId={56}
                // chainId={97} // BSC TESTNET
                connectors={{
                    walletconnect: { rpcUrl: 'bsc-dataseed4.defibit.io' },
                    walletlink: {
                        url: 'bsc-dataseed4.defibit.io',
                        appName: 'Coinbase Wallet',
                        appLogoUrl: '',
                    },
                    //   connectors={{
                    //     walletconnect: { rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545' },
                    //     walletlink: {
                    //       url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
                    //       appName: 'Coinbase Wallet',
                    //       appLogoUrl: '',
                    //     },
                }}
            >
                <Main
                    assetsUrl={`${process.env.PUBLIC_URL}/aragon-ui/`}
                    theme={themes[theme]}
                    layout={false}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                    >
                        <div style={{ flex: 'auto', overflowY: 'auto' }}>
                            <Switch>
                                <Route path='/' exact>
                                    <Landing />
                                </Route>
                                <Route path='/'>
                                    <NavBar
                                        hasWeb3={hasWeb3}
                                        user={user}
                                        setUser={setUser}
                                    />
                                    <div style={{ padding: '0 0 80px' }}>
                                        {hasWeb3 ? (
                                            <Switch>
                                                <Route path='/claim/'>
                                                    <ClaimBSC user={user} />
                                                </Route>
                                                <Route path='/epoch/'>
                                                    <EpochDetail user={user} />
                                                </Route>
                                                <Route path='/coupons/:override'>
                                                    <CouponMarket user={user} />
                                                </Route>
                                                <Route path='/coupons/'>
                                                    <CouponMarket user={user} />
                                                </Route>
                                                <Route path='/governance/candidate/:candidate'>
                                                    <Candidate user={user} />
                                                </Route>
                                                <Route path='/governance/'>
                                                    <Governance user={user} />
                                                </Route>
                                                <Route path='/trade/'>
                                                    <Trade user={user} />
                                                </Route>
                                                <Route path='/regulation/'>
                                                    <Regulation user={user} />
                                                </Route>
                                                <Route path='/lp/:override'>
                                                    <Pool user={user} />
                                                </Route>
                                                <Route path='/lp/'>
                                                    <Pool user={user} />
                                                </Route>
                                                <Route path='/QSD/'>
                                                    <Bonding user={user} />
                                                </Route>
                                                <Route path='/QSG/'>
                                                    <PoolGov user={user} />
                                                </Route>
                                                <Route path='/dashboard/'>
                                                    <HomePage user={user} />
                                                </Route>
                                                <Route path='/tools/'>
                                                    <Tools user={user} />
                                                </Route>
                                            </Switch>
                                        ) : (
                                            <Switch>
                                                <Route exact path='/'>
                                                    <Landing />
                                                </Route>
                                                <Route>
                                                    <HomePageNoWeb3 />
                                                </Route>
                                            </Switch>
                                        )}
                                    </div>
                                </Route>
                            </Switch>
                        </div>
                        <Footer hasWeb3={hasWeb3} updateTheme={updateTheme} />
                    </div>
                </Main>
            </UseWalletProvider>
        </Router>
    );
}

export default App;
