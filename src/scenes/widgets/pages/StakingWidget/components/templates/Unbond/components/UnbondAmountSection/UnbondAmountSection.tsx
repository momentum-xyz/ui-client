import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {Input, Text} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit';
import {useStore} from 'shared/hooks/useStore';
import {stakingInputRegex} from 'core/utils';

import * as styled from './UnbondAmountSection.styled';

interface PropsInterface extends PropsWithThemeInterface {}

const UnbondAmountSection: FC<PropsInterface> = ({theme}) => {
  const {polkadotProviderStore} = useStore().widgetStore.stakingStore;
  const {unbondAmount, setUnbondAmount, stashAccountBalance} = polkadotProviderStore;

  useEffect(() => {
    setUnbondAmount(Number(stashAccountBalance?.bonded));
  }, [stashAccountBalance?.bonded, setUnbondAmount]);

  const unbondAmountHandler = (value: string) => {
    if (stakingInputRegex(value)) {
      setUnbondAmount(Number(value));
    }
  };
  return (
    <styled.FormField>
      <styled.LabelContainer>
        <Text
          theme={theme}
          text={t('staking.unbondAmount')}
          size="xxs"
          align="right"
          weight="bold"
          transform="uppercase"
        />
      </styled.LabelContainer>
      <Input
        value={unbondAmount}
        onChange={unbondAmountHandler}
        label=""
        placeholder={t('staking.selectAmount')}
      />
    </styled.FormField>
  );
};

export default observer(UnbondAmountSection);
