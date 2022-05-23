import React, {useEffect} from 'react';
import {t} from 'i18next';
import {useTheme} from 'styled-components';
import {observer} from 'mobx-react-lite';

import {Dropdown, OptionInterface, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {REWARD_DESTINATION_TYPES} from 'core/constants';
import {Payee} from 'core/enums';

import * as styled from './RewardSection.styled';

const RewardSection = () => {
  const theme = useTheme();
  const {controllerAccount, stashAccount, setPaymentDestination, paymentDestination} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  const paymentDestinationOptions =
    stashAccount && controllerAccount ? REWARD_DESTINATION_TYPES : [];

  const selectPaymentDestinationHandler = (option: OptionInterface) => {
    setPaymentDestination(option.value as Payee);
  };

  useEffect(() => {
    if (!paymentDestination) {
      setPaymentDestination(paymentDestinationOptions[0].value);
    }
  });

  return (
    <>
      <styled.FormField>
        <styled.LabelContainer>
          <Text
            theme={theme}
            text={t('staking.rewardDestination')}
            size="xxs"
            align="right"
            weight="bold"
            transform="uppercase"
          />
        </styled.LabelContainer>
        <Dropdown
          placeholder={t('staking.pickDestination')}
          value={paymentDestination}
          options={paymentDestinationOptions}
          onOptionSelect={selectPaymentDestinationHandler}
          variant="secondary"
        />
      </styled.FormField>
    </>
  );
};

export default observer(RewardSection);
