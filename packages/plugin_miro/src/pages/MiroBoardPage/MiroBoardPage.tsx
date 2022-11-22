import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'shared/hooks/useStore';
import {useSpace} from '@momentum-xyz/sdk';
import {SpacePage, SpaceTopBar} from '@momentum-xyz/ui-kit';

import {MiroActions, MiroBoard, MiroChoice} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const store = useStore();
  const {api, miroBoardStore} = store;
  const {board, pickBoard, disableBoard} = miroBoardStore;
  const {isAdmin, spaceName, spaceId, pluginApi, onClose} = useSpace();
  const {useStateItemChange, useStateItemRemove} = pluginApi;

  useEffect(() => {
    miroBoardStore.init(api);
    miroBoardStore.fetchBoard();
  }, [api, miroBoardStore]);

  useStateItemChange('board', miroBoardStore.handleBoardChange);

  useStateItemRemove('board', miroBoardStore.handleBoardRemove);

  if (!spaceId) {
    return null;
  }

  return (
    <SpacePage>
      <SpaceTopBar
        title={spaceName ?? ''}
        subtitle={board?.name}
        isAdmin={isAdmin}
        spaceId={spaceId}
        editSpaceHidden
        onLeave={() => onClose?.()}
        isSpaceFavorite={false}
        toggleIsSpaceFavorite={() => {}}
      >
        <MiroActions
          spaceId={spaceId}
          isAdmin={isAdmin}
          board={board}
          pick={pickBoard}
          disable={disableBoard}
        />
      </SpaceTopBar>
      <styled.Container>
        {!board?.accessLink ? (
          <MiroChoice isAdmin={isAdmin} pickBoard={miroBoardStore.pickBoard} />
        ) : (
          <MiroBoard miroUrl={board.accessLink} />
        )}
      </styled.Container>
    </SpacePage>
  );
};

export default observer(MiroBoardPage);
