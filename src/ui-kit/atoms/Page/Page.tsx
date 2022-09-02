import React, {FC} from 'react';

import {SimpleProfileMenu} from 'ui-kit';

import * as styled from './Page.styled';

interface PropsInterface {
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
