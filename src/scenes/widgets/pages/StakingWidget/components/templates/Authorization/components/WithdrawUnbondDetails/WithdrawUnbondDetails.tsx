import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Heading, Text} from 'ui-kit';
import {useStore} from 'shared/hooks/useStore';

import * as styled from './WithdrawUnbondDetails.styled';

const WithdrawUnbondDetails = () => {
  const {unbondAmount, tokenSymbol, transactionSigner} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  return (
    <>
      <Heading type="h2" align="left" weight="bold" label={t('staking.transactionCalls')} />
      <styled.Row>
        <Text
          text={t('staking.withdrawUnbondedCall')}
          size="xs"
          weight="bold"
          transform="uppercase"
        />
        <styled.CurrentAddress>
          <Text text={`${unbondAmount} ${tokenSymbol}`} size="xs" align="left" />
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

export default observer(WithdrawUnbondDetails);
