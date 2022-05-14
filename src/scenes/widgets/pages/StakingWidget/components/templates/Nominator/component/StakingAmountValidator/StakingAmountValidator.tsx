import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {BN} from '@polkadot/util';

import Message from 'ui-kit/atoms/Message/Message';
import {IconSvg, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {MessageType} from 'core/types';
import {StakeValidatorErrorType} from 'core/types';
import {formatExistential} from 'core/utils';

import * as styled from './StakingAmountValidator.styled';

const StakingAmountValidator = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {existentialDeposit, minNominatorBond, bondAmountValidation} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  const [{errorMessage, errorType}, setError] = useState<StakeValidatorErrorType>({
    errorMessage: '',
    errorType: ''
  });

  useEffect(() => {
    if (bondAmountValidation.gtStashFunds) {
      setError({
        errorMessage: t('staking.validation.stakeAmount.notEnough'),
        errorType: 'danger'
      });
    } else if (bondAmountValidation.ltThenExistentialDeposit) {
      setError({
        errorMessage: t('staking.validation.stakeAmount.minExistentialDeposit', {
          existentialDeposit: formatExistential(existentialDeposit as BN)
        }),
        errorType: 'danger'
      });
    } else if (bondAmountValidation.ltMinNominatorBond) {
      setError({
        errorMessage: t('staking.validation.stakeAmount.minNominatorBond', {minNominatorBond}),
        errorType: 'danger'
      });
    } else {
      setError({errorMessage: '', errorType: ''});
    }
  }, [bondAmountValidation, existentialDeposit, minNominatorBond, t]);

  return (
    <>
      {errorMessage && (
        <styled.StakingAmountValidatorStyled>
          <Message type={errorType as MessageType} theme={theme}>
            <IconSvg name="warning" size="normal" isWhite={true} />
            <Text text={errorMessage} weight="normal" align="left" size="xs" />
          </Message>
        </styled.StakingAmountValidatorStyled>
      )}
    </>
  );
};

export default observer(StakingAmountValidator);
