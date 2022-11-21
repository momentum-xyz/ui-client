import React, {FC} from 'react';

import * as styled from './SpacePage.styled';

interface PropsInterface {
  dataTestId?: string;
}

const SpacePage: FC<PropsInterface> = ({dataTestId, children}) => (
  <styled.Container data-testid={dataTestId}>{children}</styled.Container>
);

export default SpacePage;
