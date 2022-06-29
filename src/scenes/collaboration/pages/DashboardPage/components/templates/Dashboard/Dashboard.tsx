import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {COLUMNS} from 'core/constants';

import * as styled from './Dashboard.styled';
import TileItem from './components/TileItem/TileItem';

const Dashboard: FC = () => {
  const {
    collaborationStore: {dashboardStore, spaceStore}
  } = useStore();

  useEffect(() => {
    if (!spaceStore.space.id) {
      return;
    }
    dashboardStore.fetchDashboard(spaceStore.space.id);

    return () => {
      dashboardStore.resetModel();
    };
  }, []);

  return (
    <styled.Container>
      <styled.Content>
        <styled.CoreContainer>
          {COLUMNS.map((column, index) => (
            <div key={index} className="flex-1 flex flex-col gap-1">
              {column}
              <div className="h-full flex flex-col">
                {dashboardStore.tileList.tileMatrix[index].map((tile) => (
                  <TileItem key={tile.id} tile={tile} />
                ))}
              </div>
            </div>
          ))}
        </styled.CoreContainer>
      </styled.Content>
    </styled.Container>
  );
};

export default observer(Dashboard);
