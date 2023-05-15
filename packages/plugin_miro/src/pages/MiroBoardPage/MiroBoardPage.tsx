import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'shared/hooks/useStore';
import {useObject} from '@momentum-xyz/sdk';
import {Panel} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {MiroActions, MiroBoard, MiroChoice} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const store = useStore();
  const {api, miroBoardStore} = store;
  const {board, pickBoard, disableBoard} = miroBoardStore;
  const {
    isAdmin,
    objectId,
    pluginApi,
    // isExpanded,
    onClose
    // onToggleExpand
  } = useObject();
  const {useStateItemChange, useStateItemRemove} = pluginApi;

  const {t} = useI18n();

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
    // It's not really used now and after migration to new ui-kit some additional visual fixes may be need
    <Panel
      variant="primary"
      size="large"
      title={t('plugin_miro.labels.miro')}
      // subtitle={board?.name}
      onClose={onClose}
      // onToggleExpand={onToggleExpand}
      // isExpanded={isExpanded}
    >
      <MiroActions
        objectId={objectId}
        isAdmin={isAdmin}
        board={board}
        pick={pickBoard}
        disable={disableBoard}
      />
      {/* </ObjectTopBar> */}
      <styled.Container>
        {!board?.accessLink ? (
          <MiroChoice isAdmin={isAdmin} pickBoard={miroBoardStore.pickBoard} />
        ) : (
          <MiroBoard miroUrl={board.accessLink} />
        )}
      </styled.Container>
    </Panel>
  );
};

export default observer(MiroBoardPage);
