import React, {FC, memo} from 'react';
import {PropsWithThemeInterface, IconSvg, IconNameType} from '@momentum-xyz/ui-kit';

import * as styled from './MagicLink.styled';

interface PropsInterface extends PropsWithThemeInterface {
  icon: IconNameType;
  value?: string | null;
}

const MagicLink: FC<PropsInterface> = ({icon, value}) => {
  return (
    <styled.Container data-testid="Location-test">
      <IconSvg name={icon} />
      <span>{value}</span>
    </styled.Container>
  );
};

export default memo(MagicLink);
