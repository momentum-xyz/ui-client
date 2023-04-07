import {FC, PropsWithChildren} from 'react';

import * as styled from './Frame.styled';

const Frame: FC<PropsWithChildren> = ({children}) => {
  return <styled.Container data-testid="Frame-test">{children}</styled.Container>;
};

export default Frame;
