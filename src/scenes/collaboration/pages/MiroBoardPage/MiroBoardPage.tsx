import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {MiroBoardInterface} from 'api';
import {appVariables} from 'api/constants';
import {Button, TopBar} from 'ui-kit';
import {usePosBusEvent, useStore} from 'shared/hooks';

import 'core/utils/boardsPicker.1.0.js';

import {MiroBoard, MiroChoice} from './components/templates';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {collaborationStore} = useStore();
  const {spaceStore, miroBoardStore} = collaborationStore;
  const {space, isAdmin} = spaceStore;
  const {miroBoard, miroBoardTitle} = miroBoardStore;

  const {t} = useTranslation();

  usePosBusEvent('miro-board-change', (id) => {
    if (space?.id === id && space?.id) {
      miroBoardStore.fetchMiroBoard(space.id);
    }
  });

  useEffect(() => {
    if (space?.id) {
      miroBoardStore.fetchMiroBoard(space.id);
      //miroBoardStore.disableMiroBoard(space.id);
    }
  }, [miroBoardStore, space.id]);

  const pickBoard = useCallback(() => {
    // @ts-ignore: js-variable
    miroBoardsPicker.open({
      action: 'access-link',
      clientId: appVariables.MIRO_APP_ID,
      success: async (data: MiroBoardInterface) => {
        if (space?.id) {
          await miroBoardStore.enableMiroBoard(space.id, data);
          await miroBoardStore.fetchMiroBoard(space.id);
        }
      }
    });
  }, [miroBoardStore, space.id]);

  return (
    <styled.Container>
      <TopBar title={space?.name ?? ''} subtitle={miroBoardTitle} onClose={() => {}}>
        {isAdmin && !!miroBoard?.data && (
          <Button label={t('actions.changeBoard')} variant="primary" onClick={pickBoard} />
        )}
      </TopBar>
      <div>
        {!miroBoard?.data?.accessLink ? (
          <MiroChoice isAdmin={isAdmin} pickBoard={pickBoard} />
        ) : (
          <MiroBoard miroUrl={miroBoard.data.accessLink} />
        )}
      </div>
    </styled.Container>
  );
};

export default observer(MiroBoardPage);
