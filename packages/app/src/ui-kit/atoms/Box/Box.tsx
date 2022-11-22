import React, {FC} from 'react';

import * as styled from './Box.styled';

const Box: FC = ({children}) => {
  return <styled.Div>{children}</styled.Div>;
};

export default Box;
