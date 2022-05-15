import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';

import {Dialog, Loader} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {StatisticsBlockList} from './components';
import * as styled from './WorldStatsWidget.styled';

const DIALOG_OFFSET_RIGHT = 15;
const DIALOG_OFFSET_BOTTOM = 60;

const WorldStatsWidget: FC = () => {
  const {
    widgetStore: {worldStatsStore},
    mainStore: {worldStore}
  } = useStore();
  const {statsDialog, worldStats} = worldStatsStore;
  const {statistics, isLoading} = worldStats;

  const theme = useTheme();

  useEffect(() => {
    if (worldStore.worldId) {
      worldStatsStore.init(worldStore.worldId);
    }

    return () => {
      worldStatsStore.resetModel();
    };
  }, [worldStats, worldStore.worldId]);

  return (
    <Dialog
      title=" "
      theme={theme}
      position="rightBottom"
      headerStyle="uppercase"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      onClose={statsDialog.close}
      showCloseButton
      withOpacity
    >
      <styled.Container>
        {isLoading && <Loader />}
        {!!statistics.length && <StatisticsBlockList theme={theme} blockList={statistics} />}
      </styled.Container>
    </Dialog>
  );
};

export default observer(WorldStatsWidget);
