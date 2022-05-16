import React, {FC} from 'react';

import {IconSvg, PropsWithThemeInterface, Tooltip} from 'ui-kit';
import {useStore} from 'shared/hooks';
import SubstrateProvider from "shared/services/web3/SubstrateProvider";

import * as styled from './UnbondingIndicator.styled';

interface PropsInterface extends PropsWithThemeInterface {}

export const UnbondingIndicator: FC<PropsInterface> = ({theme}) => {
  const {widgetStore} = useStore();
  const {stakingInfo, sessionProgress} = widgetStore.stakingStore.polkadotProviderStore;
  const progress = SubstrateProvider.deriveUnbondingProgress(stakingInfo, sessionProgress);
  console.log(progress)
  return (
    <Tooltip label={<></>} placement="left" darkBackground size={{width: '200px'}}>
      <styled.UnbondingIndicator>
        <IconSvg name="clock" theme={theme} size="large" />
      </styled.UnbondingIndicator>
    </Tooltip>
  );
};
