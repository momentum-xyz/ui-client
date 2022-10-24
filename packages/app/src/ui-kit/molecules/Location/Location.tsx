import React, {FC, memo} from 'react';
import {PropsWithThemeInterface, IconSvg, IconNameType} from '@momentum-xyz/ui-kit';

import * as styled from './Location.styled';

interface PropsInterface extends PropsWithThemeInterface {
  icon: IconNameType;
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
