import React, {FC} from 'react';
import {Heading, PropsWithThemeInterface} from '@momentum/ui-kit';
import {WorldStatItemInterface} from 'api';
import {Text, ProgressBar} from 'ui-kit';

import * as styled from './ProgressBarItem.styled';

interface PropsInterface extends PropsWithThemeInterface {
  item: WorldStatItemInterface;
}

const ProgressBarItem: FC<PropsInterface> = ({item, theme}) => {
  return (
    <styled.Grid>
      <styled.Name>
        <Heading theme={theme} type="h3" label={item.name} align="left" transform="uppercase" />
        <Text
          theme={theme}
          text={item.value}
          size="m"
          align="left"
          transform="uppercase"
          weight="bold"
        />
      </styled.Name>
      <styled.Bar>
        <styled.BarPercent>{item.progress}%</styled.BarPercent>
        <ProgressBar theme={theme} percent={Number(item.progress || 0)} />
      </styled.Bar>
    </styled.Grid>
  );
};

export default ProgressBarItem;
