import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useStore} from 'shared/hooks';
import {useSpaceGlobalProps} from '@momentum-xyz/sdk';
import {appVariables} from 'api/constants';
import {MiroBoardInterface} from 'api';
import {MiroStateInterface} from 'core/interfaces';

import {MiroBoard, MiroChoice, MiroActions} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {miroBoardStore} = useStore();
  const {renderTopBarActions} = useSpaceGlobalProps();

  const theme = useTheme();

  const {spaceId, request, isSpaceAdmin, init, setPluginSpaceStateSubField, spacePluginState} =
    useSpaceGlobalProps();

  const miroPluginState: MiroStateInterface = spacePluginState;

  const pickBoard = () => {
    miroBoardsPicker.open({
      action: 'access-link',
      clientId: appVariables.APP_ID,
      success: async (data: MiroBoardInterface) => {
        for (const [key, value] of Object.entries(data)) {
          await setPluginSpaceStateSubField('board', key, value);
        }
      }
    });
  };

  useEffect(() => {
    init(['board']);
  }, [init]);

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
  }, [isSpaceAdmin, renderTopBarActions, request, spaceId, miroBoardStore, theme]);

  if (!spaceId) {
    return null;
  }

  return (
    <styled.Container>
      {!miroPluginState.board?.accessLink ? (
        <MiroChoice isAdmin={isSpaceAdmin} pickBoard={pickBoard} />
      ) : (
        <MiroBoard miroUrl={miroPluginState.board.accessLink} />
      )}
    </styled.Container>
  );
};

export default observer(MiroBoardPage);
