import React from 'react';
import {t} from 'i18next';
import {Text} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks/useStore';

import * as styled from './UbondDetails.styled';

export const UnbondDetails = () => {
  const {stashAccount, bondedControllerAddress} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  return (
    <>
      <styled.row>
        <Text text={t('staking.stashAccount')} size="xs" weight="bold" transform="uppercase" />
        <styled.address>
          <Text text={stashAccount?.address || ''} size="xs" align="left" />
        </styled.address>
      </styled.row>
      <styled.row>
        <Text text={t('staking.controllerAccount')} size="xs" weight="bold" transform="uppercase" />
        <styled.address>
          <Text text={bondedControllerAddress} size="xs" align="left" />
        </styled.address>
      </styled.row>
    </>
  );
};
