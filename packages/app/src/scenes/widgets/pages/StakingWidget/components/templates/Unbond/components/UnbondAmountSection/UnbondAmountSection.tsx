import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {PropsWithThemeInterface} from '@momentum/ui-kit';

import {Input, Text} from 'ui-kit';
import {useStore} from 'shared/hooks/useStore';
import {stakingInputRegex} from 'core/utils';

import * as styled from './UnbondAmountSection.styled';

interface PropsInterface extends PropsWithThemeInterface {}

const UnbondAmountSection: FC<PropsInterface> = ({theme}) => {
  const {polkadotProviderStore} = useStore().widgetStore.stakingStore;
  const {unbondAmount, setUnbondAmount, stashStakingBalance} = polkadotProviderStore;

  useEffect(() => {
    stashStakingBalance.bonded && setUnbondAmount(stashStakingBalance.bonded);
  }, [stashStakingBalance.bonded, setUnbondAmount]);

  const unbondAmountHandler = (value: string) => {
    if (stakingInputRegex(value)) {
      setUnbondAmount(value);
    }
  };
  return (
    <styled.FormField>
      <styled.LabelContainer>
        <Text
          theme={theme}
          text={t('staking.unbondAmount')}
          size="xxs"
          align="left"
          weight="bold"
          transform="uppercase"
        />
      </styled.LabelContainer>
      <styled.InputContainer>
        <Input
          value={unbondAmount}
          onChange={unbondAmountHandler}
          label=""
          placeholder={t('staking.selectAmount')}
        />
      </styled.InputContainer>
    </styled.FormField>
  );
};

export default observer(UnbondAmountSection);
