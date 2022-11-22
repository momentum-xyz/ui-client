import React, {FC} from 'react';

import * as styled from './SpacePage.styled';

interface PropsInterface {
  dataTestId?: string;
  withMeeting?: boolean;
}

const SpacePage: FC<PropsInterface> = ({dataTestId, children, withMeeting = false}) => (
  <styled.Container data-testid={dataTestId} className={withMeeting ? 'withMeeting' : undefined}>
    {children}
  </styled.Container>
);

export default SpacePage;
