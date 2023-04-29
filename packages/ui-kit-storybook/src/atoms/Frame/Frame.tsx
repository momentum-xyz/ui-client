import {FC, PropsWithChildren} from 'react';

import * as styled from './Frame.styled';

export interface FramePropsInterface extends PropsWithChildren {
  title?: string;
}

const Frame: FC<FramePropsInterface> = (props) => {
  const {title, children} = props;
  return (
    <styled.Container data-testid="Frame-test">
      {title && <styled.Title>{title}</styled.Title>}
      {children && <styled.Content>{children}</styled.Content>}
    </styled.Container>
  );
};

export default Frame;
