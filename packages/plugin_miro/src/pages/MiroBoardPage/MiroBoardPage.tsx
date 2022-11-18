import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'shared/hooks/useStore';
import {useSpace} from '@momentum-xyz/sdk';

import {MiroBoard, MiroChoice} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {api, miroBoardStore} = useStore();
  const {board} = miroBoardStore;
  const {isAdmin, spaceId, pluginApi} = useSpace();
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
