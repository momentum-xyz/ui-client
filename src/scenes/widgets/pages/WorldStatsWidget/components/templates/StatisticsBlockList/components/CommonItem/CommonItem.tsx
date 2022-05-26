import React, {FC} from 'react';

import {WorldStatItemInterface} from 'api';
import {Heading, PropsWithThemeInterface, Text} from 'ui-kit';

import * as styled from './CommonItem.styled';

interface PropsInterface extends PropsWithThemeInterface {
  item: WorldStatItemInterface;
}

const CommonItem: FC<PropsInterface> = ({item, theme}) => {
  return (
    <styled.Wrapper>
      <Heading theme={theme} type="h3" label={item.name} align="left" transform="uppercase" />
      <Text
        theme={theme}
        text={item.value}
        size="m"
        align="left"
        transform="uppercase"
        weight="bold"
      />
    </styled.Wrapper>
  );
};

export default CommonItem;
