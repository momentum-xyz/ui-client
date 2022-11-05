import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'shared/hooks/useStore';
import {useSpace, useSpaceTopBar} from '@momentum-xyz/sdk';

import {MiroBoard, MiroChoice, MiroActions} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {api, miroBoardStore} = useStore();
  const {board} = miroBoardStore;
  const {isAdmin, spaceId} = useSpace();
  const {render} = useSpaceTopBar();

  useEffect(() => {
    miroBoardStore.init(api);
    miroBoardStore.fetchBoard();
  }, [api, miroBoardStore]);

  useEffect(() => {
    render?.({
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
  }, [board, isAdmin, miroBoardStore.disableBoard, miroBoardStore.pickBoard, render, spaceId]);

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
