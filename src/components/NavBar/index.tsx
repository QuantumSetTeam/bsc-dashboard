import { LinkBase, useTheme } from '@aragon/ui';
import React from 'react';
import { NavLink } from 'react-router-dom';
import ConnectButton from './ConnectButton';

type NavbarProps = {
  hasWeb3: boolean;
  user: string;
  setUser: Function;
};

function NavBar({ hasWeb3, user, setUser }: NavbarProps) {
  const theme = useTheme();
  const isDark = theme._name === 'dark';
  const opacity = isDark ? 0.3 : 0.5;

  function LinkButton(props: {
    title: string;
    to: string;
    style?: React.CSSProperties;
  }) {
    return (
      <NavLink
        to={props.to}
        component={LinkBase}
        activeStyle={{ opacity: 1 }}
        exact
        style={{
          opacity,
          ...props.style,
        }}
        {...{
          external: false,
        }}
      >
        <NavButton>{props.title}</NavButton>
      </NavLink>
    );
  }

  function ExternalButton(props: { title: string; href: string }) {
    return (
      <LinkBase href={props.href} style={{ opacity }}>
        <NavButton>{props.title}</NavButton>
      </LinkBase>
    );
  }

  function NavButton({ children, ...props }: React.ComponentProps<'div'>) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          marginLeft: '8px',
          marginRight: '8px',
          height: '40px',
        }}
        {...props}
      >
        <span style={{ display: 'block', padding: '1%', fontSize: '17px' }}>
          {children}
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          fontSize: '14px',
        }}
      >
        <div
          style={{
            margin: "0 auto",
            maxWidth: '1104px',
          }}
        >
          <div
            style={{
              display: 'flex',
              padding: '24px 0',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <NavLink
              to='/dashboard'
              component={LinkBase}
              activeStyle={{ opacity: 1 }}
              exact
              style={{
                marginRight: '16px',
                height: 64,
                opacity,
                display: 'flex',
                alignItems: 'center',
              }}
              {...{ external: false }}
            >
              <img
                src={`./logo/logo${isDark ? 'Solid' : 'SolidLight'}.png`}
                alt='logo'
                width={64}
              />
              <div style={{ fontSize: 22 }}>Smart Chain Dollar</div>
            </NavLink>
            <div style={{ textAlign: 'center' }}>
              <LinkButton title='Dashboard' to='/dashboard/' />
              <LinkButton title='Bootstrapping' to='/bootstrapping/' />
              <LinkButton title='QSD' to='/qsd/' />
              <LinkButton title='LP' to='/lp/' />
              <LinkButton title='QSG' to='/qsg/' />
              {/* <LinkButton title="Regulation" to="/regulation/" /> */}
              <LinkButton title='Governance' to='/governance/' />
              {/* <LinkButton title="Trade" to="/trade/" /> */}
              {/* <LinkButton title="Coupons" to="/coupons/" /> */}
              <LinkButton title='Tools' to='/tools/' />
              <ExternalButton
                title='Docs'
                href='https://docs.quantumset.finance/'
              />
            </div>
            <ConnectButton hasWeb3={hasWeb3} user={user} setUser={setUser} />
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
