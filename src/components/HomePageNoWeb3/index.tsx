import { Layout, LinkBase } from '@aragon/ui';
import React from 'react';
import { Tile } from '../common';

function HomePageNoWeb3() {
  return (
    <Layout>
      <LinkBase
        onClick={() => {
          // @ts-ignore
          window.location = 'https://www.metamask.io/';
        }}
        style={{ width: '100%' }}
      >
        <Tile
          line1='No web3 wallet detected'
          line2={<i className='fas fa-times-circle' />}
          line3='Click to get Metamask.'
        />
      </LinkBase>
    </Layout>
  );
}

export default HomePageNoWeb3;
