import React, {FC} from 'react';

import * as styled from './Page.styled';

interface PropsInterface {
  backgroundSrc?: string;
}

const Page: FC<PropsInterface> = ({backgroundSrc, children}) => (
  <styled.Container data-testid="Page-test">
    <styled.Background src={backgroundSrc} />
    <styled.BackgroundFilter />

    <styled.PageContainer>{children}</styled.PageContainer>
  </styled.Container>
);

export default Page;
