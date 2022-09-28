import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';

import {useGlobalProps} from 'core/contexts';
import {useStore} from 'shared/hooks';

import {MiroBoard, MiroChoice, MiroActions} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {miroBoardStore} = useStore();
  const {renderTopBarActions} = useGlobalProps();
  const {miroBoard} = miroBoardStore;

  const theme = useTheme();

  const props = useGlobalProps();

  const {spaceId, request, isSpaceAdmin} = props;

  useEffect(() => {
    if (spaceId) {
      miroBoardStore.fetchMiroBoard(spaceId, request);
    }

    return () => {
      miroBoardStore.resetModel();
    };
  }, [miroBoardStore, request, spaceId]);

  useEffect(() => {
    renderTopBarActions?.({
      main: () => (
        <MiroActions
          theme={theme}
          spaceId={spaceId}
          request={request}
          isAdmin={isSpaceAdmin}
          miroBoardStore={miroBoardStore}
        />
      )
    });
  }, [isSpaceAdmin, props, renderTopBarActions, request, spaceId, miroBoardStore, theme]);

  if (!spaceId) {
    return null;
  }

  return (
    <styled.Container>
      {!miroBoard?.data?.accessLink ? (
        <MiroChoice
          isAdmin={isSpaceAdmin}
          pickBoard={() => miroBoardStore.pickBoard(spaceId, request)}
        />
      ) : (
        <MiroBoard miroUrl={miroBoard.data.accessLink} />
      )}
    </styled.Container>
  );
};

export default observer(MiroBoardPage);
