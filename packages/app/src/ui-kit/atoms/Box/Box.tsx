import React, {FC, ReactNode} from 'react';

import * as styled from './Box.styled';

interface PropsInterface {
  size?: 'normal' | 'small' | 'big' | 'wide';
  children: ReactNode;
}

const Box: FC<PropsInterface> = (props) => {
  const {size = 'normal', children} = props;

  return <styled.Div className={size}>{children}</styled.Div>;
};

export default Box;
