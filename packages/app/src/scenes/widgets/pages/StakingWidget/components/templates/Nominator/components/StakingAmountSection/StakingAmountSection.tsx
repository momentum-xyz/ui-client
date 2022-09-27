import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {Text, Input} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {stakingInputRegex} from 'core/utils';

import StakingAmountValidator from '../StakingAmountValidator/StakingAmountValidator';

import * as styled from './StakingAmountSection.styled';

interface PropsInterface extends PropsWithThemeInterface {}

const StakingAmountSection: FC<PropsInterface> = ({theme}) => {
  const {polkadotProviderStore} = useStore().widgetStore.stakingStore;
  const {stakingAmount, setStakingAmount} = polkadotProviderStore;

  const stakingAmountHandler = (value: string) => {
    if (stakingInputRegex(value)) {
      setStakingAmount(value);
    }
  };

  return (
    <>
      <styled.FormField>
        <styled.LabelContainer>
          <Text
            theme={theme}
            text={t('staking.setAmount')}
            size="xxs"
            align="right"
            weight="bold"
            transform="uppercase"
          />
        </styled.LabelContainer>
        <Input
          value={stakingAmount}
          onChange={stakingAmountHandler}
          label=""
          placeholder={t('staking.selectAmount')}
        />
      </styled.FormField>
      <StakingAmountValidator />
    </>
  );
};

export default observer(StakingAmountSection);
