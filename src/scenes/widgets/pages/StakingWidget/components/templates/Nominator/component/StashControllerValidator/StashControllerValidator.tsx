import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {IconSvg, Text, Message, PropsWithThemeInterface} from 'ui-kit';
import {StakeValidatorErrorType, MessageType} from 'core/types';
import {useStore} from 'shared/hooks';

import * as styled from './StashControllerValidator.styled';

interface PropsInterface extends PropsWithThemeInterface {}

const StashControllerValidator: FC<PropsInterface> = ({theme}) => {
  const {
    bondedAddress,
    controllerAccount,
    stashAccount,
    controllerAccountValidation,
    usedStashAddress
  } = useStore().widgetStore.stakingStore.polkadotProviderStore;

  const [{errorMessage, errorType}, setError] = useState<StakeValidatorErrorType>({
    errorMessage: '',
    errorType: ''
  });

  useEffect(() => {
    let newError: string;
    let errorType: MessageType | '';
    if (controllerAccountValidation.isMappedToAnotherStash) {
      errorType = 'danger';
      newError = t('staking.validation.controller.stashed', {bondedAddress});
    } else if (controllerAccountValidation.isManagingMultipleStashes) {
      errorType = 'danger';
      newError = t('staking.validation.controller.multipleStashes', {usedStashAddress});
    } else if (controllerAccountValidation.sufficientFunds) {
      errorType = 'danger';
      newError = t('staking.validation.controller.sufficientFunds');
    } else if (stashAccount?.address === controllerAccount?.address) {
      errorType = 'warning';
      newError = t('staking.validation.controller.distinctAccounts');
    } else {
      newError = '';
      errorType = '';
    }

    setError((state) =>
      state.errorMessage !== newError ? {errorMessage: newError, errorType} : state
    );
  }, [
    controllerAccount?.address,
    controllerAccountValidation,
    stashAccount?.address,
    usedStashAddress
  ]);

  return (
    <>
      {errorMessage && errorType && (
        <styled.Container>
          <Message type={errorType} theme={theme}>
            <IconSvg name="warning" size="normal" isWhite={true} />
            <Text text={errorMessage} weight="normal" align="left" size="xs" />
          </Message>
        </styled.Container>
      )}
    </>
  );
};

export default observer(StashControllerValidator);
