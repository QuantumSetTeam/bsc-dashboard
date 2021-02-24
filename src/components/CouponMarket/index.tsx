import React, { useState } from 'react';
import { Header, Layout } from '@aragon/ui';
import { useParams } from 'react-router-dom';

import ModalWarning from './ModalWarning';
import IconHeader from '../common/IconHeader';
import { getPreference, storePreference } from '../../utils/storage';
import { CheckBox } from '../common';

function CouponMarket({ user }: { user: string }) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const storedHideRedeemed = getPreference('hideRedeemedCoupons', '0');

  const [hideRedeemed, setHideRedeemed] = useState(storedHideRedeemed === '1');

  return (
    <Layout>
      <ModalWarning />

      <IconHeader
        icon={<i className='fas fa-ticket-alt' />}
        text='Coupon Market'
      />

      <Header primary='Purchase' />

      <div style={{ display: 'flex' }}>
        <Header primary='Coupons' />
        <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
          <CheckBox
            text='Hide Redeemed'
            onCheck={(checked) => {
              storePreference('hideRedeemedCoupons', checked ? '1' : '0');
              setHideRedeemed(checked);
            }}
            checked={hideRedeemed}
          />
        </div>
      </div>
    </Layout>
  );
}

export default CouponMarket;
