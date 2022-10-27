import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useSpaceGlobalProps} from '@momentum-xyz/sdk';
import {appVariables} from 'api/constants';
import {MiroBoardInterface} from 'core/interfaces';

import {MiroBoard, MiroChoice, MiroActions} from './components';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const theme = useTheme();

  const {spaceId, isSpaceAdmin, api, renderTopBarActions} = useSpaceGlobalProps();

  const [board, setBoard] = useState<MiroBoardInterface>();

  const pickBoard = useCallback(() => {
    miroBoardsPicker.open({
      action: 'access-link',
      clientId: appVariables.APP_ID,
      success: async (data: MiroBoardInterface) => {
        await api.set('board', data);
      }
    });
  }, [api]);

  useEffect(() => {
    api.get<MiroBoardInterface>('board').then(setBoard);
  }, [api]);

  useEffect(() => {
    renderTopBarActions?.({
      main: () => (
        <MiroActions
          theme={theme}
          spaceId={spaceId}
          isAdmin={isSpaceAdmin}
          board={board}
          pick={pickBoard}
          disable={() => {
            api.set('board', undefined).then(() => () => setBoard(undefined));
          }}
        />
      )
    });
  }, [api, board, isSpaceAdmin, pickBoard, renderTopBarActions, spaceId, theme]);

  if (!spaceId) {
    return null;
  }

  return (
    <styled.Container>
      {!board?.accessLink ? (
        <MiroChoice isAdmin={isSpaceAdmin} pickBoard={pickBoard} />
      ) : (
        <MiroBoard miroUrl={board.accessLink} />
      )}
    </styled.Container>
  );
};

export default observer(MiroBoardPage);
