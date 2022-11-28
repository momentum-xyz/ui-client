import React from 'react';
import {t} from 'i18next';
import {useTheme} from 'styled-components';
import {observer} from 'mobx-react-lite';
import {Dropdown, OptionInterface, Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import StashControllerValidator from '../StashControllerValidator/StashControllerValidator';

import * as styled from './AccountSection.styled';

const AccountSection = () => {
  const theme = useTheme();
  const {
    stashAccount,
    controllerAccount,
    addressOptions,
    setStashAccount,
    setControllerAccount,
    getBondedAddress,
    getUsedStashAddress
  } = useStore().widgetStore.stakingStore.polkadotProviderStore;

  const selectStashHandler = (option: OptionInterface) => {
    setStashAccount(option.value);
  };
  const selectControllerHandler = (option: OptionInterface) => {
    setControllerAccount(option.value);
    getBondedAddress(option.value);
    getUsedStashAddress(option.value);
  };
  return (
    <styled.StakingSection>
      <styled.FormField>
        <styled.LabelContainer>
          <Text
            theme={theme}
            text={t('staking.stashLabel')}
            size="xxs"
            align="right"
            weight="bold"
            transform="uppercase"
          />
        </styled.LabelContainer>
        <Dropdown
          placeholder={t('staking.pickAccount')}
          value={stashAccount?.address}
          options={addressOptions}
          onOptionSelect={selectStashHandler}
          variant="secondary"
        />
      </styled.FormField>
      <styled.FormField>
        <styled.LabelContainer>
          <Text
            theme={theme}
            text={t('staking.stashController')}
            size="xxs"
            align="right"
            weight="bold"
            transform="uppercase"
          />
        </styled.LabelContainer>
        <Dropdown
          placeholder={t('staking.pickAccount')}
          value={controllerAccount?.address}
          options={addressOptions}
          onOptionSelect={selectControllerHandler}
          variant="secondary"
        />
      </styled.FormField>
      <StashControllerValidator />
    </styled.StakingSection>
  );
};

export default observer(AccountSection);
