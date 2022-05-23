import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {Heading, Text} from 'ui-kit';

import * as styled from './ChillDetails.styled';

const ChillDetails = () => {
  const {transactionSigner} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  return (
    <>
      <Heading type="h2" align="left" weight="bold" label={t('staking.transactionCalls')} />
      <styled.Row>
        <Text text={t('staking.chillCall')} size="xs" weight="bold" transform="uppercase" />
        <styled.CurrentAddress>
          <Text text={t('staking.chillInfo')} size="xs" align="left" />
        </styled.CurrentAddress>
      </styled.Row>
      <Heading type="h2" align="left" weight="bold" label={t('staking.sendingFrom')} />
      <styled.Row>
        <Text
          text={transactionSigner?.meta?.name || ''}
          size="xs"
          weight="bold"
          transform="uppercase"
        />
        <styled.CurrentAddress>
          <Text text={transactionSigner?.address || ''} size="xs" align="left" />
        </styled.CurrentAddress>
      </styled.Row>
    </>
  );
};

export default observer(ChillDetails);
