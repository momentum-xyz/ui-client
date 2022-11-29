import React, {useEffect} from 'react';
import {t} from 'i18next';
import {useTheme} from 'styled-components';
import {observer} from 'mobx-react-lite';
import {Dropdown, OptionInterface, Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {REWARD_DESTINATION_TYPES} from 'core/constants';
import {PayeeEnum} from 'core/enums';

import {RewardValidator} from '../index';

import * as styled from './RewardSection.styled';

const RewardSection = () => {
  const theme = useTheme();
  const {
    controllerAccount,
    stashAccount,
    setPaymentDestination,
    paymentDestination,
    addressOptions,
    setCustomPaymentDestination
  } = useStore().widgetStore_OLD.stakingStore.polkadotProviderStore;

  const paymentDestinationOptions =
    stashAccount && controllerAccount ? REWARD_DESTINATION_TYPES : [];

  const selectPaymentDestinationHandler = (option: OptionInterface) =>
    setPaymentDestination(option.value as PayeeEnum);

  const selectCustomPaymentDestinationHandler = (option: OptionInterface) =>
    setCustomPaymentDestination(option.value);

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
      {paymentDestination === PayeeEnum.Account && (
        <>
          <styled.FormField>
            <styled.LabelContainer>
              <Text
                theme={theme}
                text={t('staking.specificDestination')}
                size="xxs"
                align="right"
                weight="bold"
                transform="uppercase"
              />
            </styled.LabelContainer>
            <Dropdown
              dropdownSize="small"
              placeholder={t('staking.customRewardDestination')}
              value={stashAccount?.address}
              options={addressOptions}
              onOptionSelect={selectCustomPaymentDestinationHandler}
              variant="secondary"
            />
          </styled.FormField>
          <RewardValidator />
        </>
      )}
    </>
  );
};

export default observer(RewardSection);
