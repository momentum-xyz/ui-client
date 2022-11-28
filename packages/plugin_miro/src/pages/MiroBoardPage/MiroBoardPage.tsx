import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'shared/hooks/useStore';
import {useObject} from '@momentum-xyz/sdk';
import {SpacePage, ObjectTopBar} from '@momentum-xyz/ui-kit';

import {MiroActions, MiroBoard, MiroChoice} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const store = useStore();
  const {api, miroBoardStore} = store;
  const {board, pickBoard, disableBoard} = miroBoardStore;
  const {isAdmin, pluginName, objectId, pluginApi, isExpanded, onClose, onToggleExpand} =
    useObject();
  const {useStateItemChange, useStateItemRemove} = pluginApi;

  useEffect(() => {
    miroBoardStore.init(api);
    miroBoardStore.fetchBoard();
  }, [api, miroBoardStore]);

  useStateItemChange('board', miroBoardStore.handleBoardChange);

  useStateItemRemove('board', miroBoardStore.handleBoardRemove);

  if (!objectId) {
    return null;
  }

  return (
    <SpacePage>
      <ObjectTopBar
        title={pluginName ?? ''}
        subtitle={board?.name}
        onClose={() => onClose?.()}
        onToggleExpand={onToggleExpand}
        isExpanded={isExpanded}
      >
        <MiroActions
          objectId={objectId}
          isAdmin={isAdmin}
          board={board}
          pick={pickBoard}
          disable={disableBoard}
        />
      </ObjectTopBar>
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
