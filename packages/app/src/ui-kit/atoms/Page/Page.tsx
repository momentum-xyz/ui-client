import React, {FC} from 'react';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {SimpleProfileMenu} from 'ui-kit';

import * as styled from './Page.styled';

interface PropsInterface extends PropsWithThemeInterface {
  backgroundSrc?: string;
  showSimpleProfileMenu?: boolean;
}

const Page: FC<PropsInterface> = ({backgroundSrc, children, showSimpleProfileMenu = false}) => (
  <styled.Container data-testid="Page-test">
    <styled.Background src={backgroundSrc} />
    <styled.BackgroundFilter />

    <styled.PageContainer>
      {children}
      {showSimpleProfileMenu && <SimpleProfileMenu />}
    </styled.PageContainer>
  </styled.Container>
);

export default Page;
