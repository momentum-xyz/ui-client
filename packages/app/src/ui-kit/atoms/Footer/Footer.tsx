import React, {FC} from 'react';

import * as styled from './Footer.styled';

const Footer: FC = ({children}) => {
  return <styled.Div>{children}</styled.Div>;
};

export default Footer;
