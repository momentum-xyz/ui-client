import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {Dialog, Loader} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {StatisticsBlockList} from './components';
import * as styled from './WorldStatsWidget.styled';

const DIALOG_OFFSET_RIGHT = 10;
const DIALOG_OFFSET_BOTTOM = 60;

const WorldStatsWidget: FC = () => {
  const {widgetStore, mainStore} = useStore();
  const {worldStore} = mainStore;
  const {worldStatsStore} = widgetStore;
  const {statsDialog, worldStats} = worldStatsStore;
  const {statistics, isLoading} = worldStats;
  const {worldId} = worldStore;

  const theme = useTheme();

  useEffect(() => {
    if (worldId) {
      worldStatsStore.init(worldId);
    }

    return () => {
      worldStatsStore.resetModel();
    };
  }, [worldStats, worldStatsStore, worldId]);

  return (
    <Dialog
      title=" "
      theme={theme}
      position="rightBottom"
      headerStyle="uppercase"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      onClose={statsDialog.close}
      showBackground={false}
      showCloseButton
    >
      <styled.Container data-testid="WorldStatsWidget-test">
        {isLoading && (
          <styled.Loader>
            <Loader />
          </styled.Loader>
        )}
        {!!statistics.length && <StatisticsBlockList theme={theme} blockList={statistics} />}
      </styled.Container>
    </Dialog>
  );
};

export default observer(WorldStatsWidget);
