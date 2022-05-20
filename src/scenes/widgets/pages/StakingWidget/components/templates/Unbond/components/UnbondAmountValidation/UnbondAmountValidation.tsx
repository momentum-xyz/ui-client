import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Message, IconSvg, Text} from 'ui-kit';
import {MessageType} from 'core/types';
import {PropsWithThemeInterface} from 'ui-kit/interfaces/props.interface';
import {useStore} from 'shared/hooks/useStore';
import {StakeValidatorErrorType} from 'core/types';

import * as styled from './UnbondAmountValidation.styled';

interface PropsInterface extends PropsWithThemeInterface {}

const UnbondAmountValidation: FC<PropsInterface> = ({theme}) => {
  const {unbondAmountValidation, stashAccountBalance} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  const [{errorMessage, errorType}, setError] = useState<StakeValidatorErrorType>({
    errorMessage: '',
    errorType: ''
  });

  useEffect(() => {
    let newError: string;
    let errorType: MessageType | '';
    if (unbondAmountValidation.minAmount) {
      newError = t('staking.validation.unbondMinAmount');
      errorType = 'danger';
    } else if (unbondAmountValidation.maxAmount) {
      newError = t('staking.validation.unbondMaxAmount', {bonded: stashAccountBalance?.bonded});
      errorType = 'danger';
    } else {
      newError = '';
    }

    setError((state) =>
      state.errorMessage !== newError ? {errorMessage: newError, errorType} : state
    );
  }, [
    unbondAmountValidation.minAmount,
    unbondAmountValidation.maxAmount,
    stashAccountBalance?.bonded
  ]);

  return (
    <>
      {errorMessage && errorType && (
        <styled.Container>
          <Message type={errorType as MessageType} theme={theme}>
            <IconSvg name="warning" size="normal" isWhite={true} />
            <Text text={errorMessage} weight="normal" align="left" size="xs" />
          </Message>
        </styled.Container>
      )}
    </>
  );
};

export default observer(UnbondAmountValidation);
