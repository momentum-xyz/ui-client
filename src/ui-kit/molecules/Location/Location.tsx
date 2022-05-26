import React, {FC, memo} from 'react';

import {IconSvg} from 'ui-kit/atoms';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './Location.styled';

interface PropsInterface extends PropsWithThemeInterface {
  icon: IconName;
  value?: string | null;
}

const Location: FC<PropsInterface> = ({icon, value, theme}) => {
  return (
    <styled.Container data-testid="Location-test">
      <IconSvg theme={theme} name={icon} />
      <span>{value}</span>
    </styled.Container>
  );
};

export default memo(Location);
