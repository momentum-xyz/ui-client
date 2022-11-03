import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useSpaceGlobalProps} from '@momentum-xyz/sdk';
import {useStore} from 'shared/hooks/useStore';

import {MiroBoard, MiroChoice, MiroActions} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {spaceId, isSpaceAdmin, renderTopBarActions} = useSpaceGlobalProps();
  const {api, miroBoardStore} = useStore();
  const {board} = miroBoardStore;
  const theme = useTheme();

  useEffect(() => {
    miroBoardStore.init(api);
    miroBoardStore.fetchBoard();
  }, [api, miroBoardStore]);

  useEffect(() => {
    renderTopBarActions?.({
      main: () => (
        <MiroActions
          theme={theme}
          spaceId={spaceId}
          isAdmin={isSpaceAdmin}
          board={board}
          pick={miroBoardStore.pickBoard}
          disable={miroBoardStore.disableBoard}
        />
      )
    });
  }, [
    board,
    isSpaceAdmin,
    miroBoardStore.disableBoard,
    miroBoardStore.pickBoard,
    renderTopBarActions,
    spaceId,
    theme
  ]);

  if (!spaceId) {
    return null;
  }

  return (
    <styled.Container>
      {!board?.accessLink ? (
        <MiroChoice isAdmin={isSpaceAdmin} pickBoard={miroBoardStore.pickBoard} />
      ) : (
        <MiroBoard miroUrl={board.accessLink} />
      )}
    </styled.Container>
  );
};

export default observer(MiroBoardPage);
