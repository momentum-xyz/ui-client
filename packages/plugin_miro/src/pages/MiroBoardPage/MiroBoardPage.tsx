import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'shared/hooks/useStore';
import {useSpace} from '@momentum-xyz/sdk';

import {MiroBoard, MiroChoice, MiroActions} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {api, miroBoardStore} = useStore();
  const {board} = miroBoardStore;
  const {isAdmin, spaceId, renderTopBarActions, pluginApi} = useSpace();
  const {
    useStateItemChange,
    useStateItemRemove,
    subscribeToStateUsingTopic,
    unsubscribeFromStateUsingTopic
  } = pluginApi;

  useEffect(() => {
    miroBoardStore.init(api);
    miroBoardStore.fetchBoard();
    subscribeToStateUsingTopic('miro-state');

    return () => {
      unsubscribeFromStateUsingTopic('miro-state');
    };
  }, [api, miroBoardStore, subscribeToStateUsingTopic, unsubscribeFromStateUsingTopic]);

  useEffect(() => {
    renderTopBarActions({
      main: () => (
        <MiroActions
          spaceId={spaceId}
          isAdmin={isAdmin}
          board={board}
          pick={miroBoardStore.pickBoard}
          disable={miroBoardStore.disableBoard}
        />
      )
    });
  }, [board, isAdmin, miroBoardStore, renderTopBarActions, spaceId]);

  useStateItemChange('miro-state', 'board', miroBoardStore.handleBoardChange);

  useStateItemRemove('miro-state', 'board', miroBoardStore.handleBoardRemove);

  if (!spaceId) {
    return null;
  }

  return (
    <styled.Container>
      {!board?.accessLink ? (
        <MiroChoice isAdmin={isAdmin} pickBoard={miroBoardStore.pickBoard} />
      ) : (
        <MiroBoard miroUrl={board.accessLink} />
      )}
    </styled.Container>
  );
};

export default observer(MiroBoardPage);
