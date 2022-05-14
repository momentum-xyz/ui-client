import React, {FC} from 'react';

import {IconSvg, PropsWithThemeInterface, Tooltip} from 'ui-kit';

import * as styled from './UnbondingIndicator.styled';

interface PropsInterface extends PropsWithThemeInterface {}

export const UnbondingIndicator: FC<PropsInterface> = ({theme}) => {
  // const progress = SubstrateProvider.deriveUnbondingProgress(stashStakingInfo, SessionProgress)
  return (
    <Tooltip label={<></>} placement="left" darkBackground size={{width: '200px'}}>
      <styled.UnbondingIndicator>
        <IconSvg name="clock" theme={theme} size="large" />
      </styled.UnbondingIndicator>
    </Tooltip>
  );
};
