import React, {FC} from 'react';
import {Heading} from '@momentum-xyz/ui-kit';

import * as styled from './Header.styled';

interface PropsInterface {
  title: string;
}

const Header: FC<PropsInterface> = ({title}) => (
  <styled.Wrapper>
    <Heading label={title} type="h1" align="left" transform="uppercase" />
  </styled.Wrapper>
);

export default Header;
