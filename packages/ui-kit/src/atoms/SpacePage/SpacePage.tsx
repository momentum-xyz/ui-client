import React, {FC, PropsWithChildren} from 'react';

import * as styled from './SpacePage.styled';

interface PropsInterface {
  dataTestId?: string;
  withMeeting?: boolean;
}

const SpacePage: FC<PropsWithChildren<PropsInterface>> = ({
  dataTestId,
  children,
  withMeeting = false
}) => (
  <styled.Container data-testid={dataTestId} className={withMeeting ? 'withMeeting' : undefined}>
    {children}
  </styled.Container>
);

export default SpacePage;
