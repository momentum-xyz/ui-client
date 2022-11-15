import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'shared/hooks/useStore';
import {useSpace, useSpaceAttributesApi} from '@momentum-xyz/sdk';
import {MiroBoardInterface} from 'core/interfaces';

import {MiroBoard, MiroChoice, MiroActions} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {api, miroBoardStore} = useStore();
  const {board} = miroBoardStore;
  const {isAdmin, spaceId, renderTopBarActions} = useSpace();
  const {useAttributeItemChange, useAttributeItemRemove, subscribeToTopic, unsubscribeFromTopic} =
    useSpaceAttributesApi();

  useEffect(() => {
    miroBoardStore.init(api);
    miroBoardStore.fetchBoard();
    subscribeToTopic('miro-state');

    return () => {
      unsubscribeFromTopic('miro-state');
    };
  }, [api, miroBoardStore, subscribeToTopic, unsubscribeFromTopic]);

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

  useAttributeItemChange('miro-state', 'state', 'board', (value) => {
    miroBoardStore.handleBoardChange(value as unknown as MiroBoardInterface);
  });

  useAttributeItemRemove('miro-state', 'state', 'board', () => {
    miroBoardStore.handleBoardRemove();
  });

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
