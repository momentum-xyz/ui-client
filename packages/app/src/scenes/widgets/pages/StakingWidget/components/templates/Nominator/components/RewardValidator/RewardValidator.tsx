import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {PropsWithThemeInterface} from '@momentum/ui-kit';

import {IconSvg, Text, Message} from 'ui-kit';
import {StakeValidatorErrorType, MessageType} from 'core/types';
import {useStore} from 'shared/hooks';

import * as styled from './RewardValidator.styled';

const RewardValidator: FC<PropsWithThemeInterface> = ({theme}) => {
  const {customRewardDestinationValidation} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;

  const [{errorMessage, errorType}, setError] = useState<StakeValidatorErrorType>({
    errorMessage: '',
    errorType: ''
  });

  useEffect(() => {
    let newError: string;
    let errorType: MessageType | '';
    if (customRewardDestinationValidation) {
      errorType = 'danger';
      newError = t('staking.rewardAccountError');
    } else {
      newError = '';
      errorType = '';
    }

    setError((state) =>
      state.errorMessage !== newError ? {errorMessage: newError, errorType} : state
    );
  }, [customRewardDestinationValidation]);

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
export default observer(RewardValidator);
