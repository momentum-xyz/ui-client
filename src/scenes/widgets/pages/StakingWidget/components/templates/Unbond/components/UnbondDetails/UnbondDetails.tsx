import React from 'react';

import {Text} from 'ui-kit';
import {useStore} from 'shared/hooks/useStore';

import * as styled from './UbondDetails.styled';

export const UnbondDetails = () => {
  const {stashAccount, controllerAccount} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  return (
    <>
      <styled.row>
        <Text text="stash account" size="xs" weight="bold" transform="uppercase" />
        <styled.address>
          <Text text={stashAccount?.address || ''} size="xs" align="left" />
        </styled.address>
      </styled.row>
      <styled.row>
        <Text text="controller account" size="xs" weight="bold" transform="uppercase" />
        <styled.address>
          <Text text={controllerAccount?.address || ''} size="xs" align="left" />
        </styled.address>
      </styled.row>
    </>
  );
};
