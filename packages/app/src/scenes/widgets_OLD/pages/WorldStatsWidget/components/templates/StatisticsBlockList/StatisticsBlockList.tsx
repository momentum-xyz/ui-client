import React, {FC} from 'react';
import {Heading, PropsWithThemeInterface} from '@momentum-xyz/ui-kit';

import {WorldStatInterface} from 'api';

import {CommonItem, ProgressBarItem} from './components';
import * as styled from './StatisticsBlockList.styled';

interface PropsInterface extends PropsWithThemeInterface {
  blockList: WorldStatInterface[];
}

const StatisticsBlockList: FC<PropsInterface> = ({blockList, theme}) => {
  return (
    <styled.Grid>
      {blockList.map((blockItem) => (
        <styled.GridItem key={blockItem.title}>
          <styled.Title>
            <Heading
              type="h2"
              theme={theme}
              label={blockItem.title}
              transform="normal"
              align="left"
            />
          </styled.Title>

          {blockItem.items.map((item) => {
            if (!!item.progress || item.progress === 0) {
              return <ProgressBarItem key={item.name} item={item} theme={theme} />;
            }
            return <CommonItem key={item.name} item={item} theme={theme} />;
          })}
        </styled.GridItem>
      ))}
    </styled.Grid>
  );
};

export default StatisticsBlockList;
