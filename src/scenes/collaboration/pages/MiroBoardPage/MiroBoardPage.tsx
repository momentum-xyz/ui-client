import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {MiroBoardInterface} from 'api';
import {appVariables} from 'api/constants';
import {SpaceTopBar, Button} from 'ui-kit';
import {usePosBusEvent, useStore} from 'shared/hooks';

// TODO: Refactor
import TextChatView from '../../../../component/molucules/collaboration/TextChatView';

import 'core/utils/boardsPicker.1.0.js';

import {MiroBoard, MiroChoice} from './components/templates';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {collaborationStore, mainStore} = useStore();
  const {spaceStore, miroBoardStore} = collaborationStore;
  const {space, isAdmin} = spaceStore;
  const {miroBoard, miroBoardTitle} = miroBoardStore;
  const {favoriteStore} = mainStore;

  const {t} = useTranslation();

  usePosBusEvent('miro-board-change', (id) => {
    if (space?.id === id && space?.id) {
      miroBoardStore.fetchMiroBoard(space.id);
    }
  });

  useEffect(() => {
    if (space?.id) {
      miroBoardStore.fetchMiroBoard(space.id);
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
    <styled.Inner>
      <SpaceTopBar
        title={space?.name ?? ''}
        subtitle={miroBoardTitle}
        favoriteStore={favoriteStore}
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.space?.id}
        editSpaceHidden
        onClose={() => {}}
      >
        {isAdmin && !!miroBoard?.data?.accessLink && (
          <Button label={t('actions.changeBoard')} variant="primary" onClick={pickBoard} />
        )}
      </SpaceTopBar>
      <styled.Container>
        {!miroBoard?.data?.accessLink ? (
          <MiroChoice isAdmin={isAdmin} pickBoard={pickBoard} />
        ) : (
          <MiroBoard miroUrl={miroBoard.data.accessLink} />
        )}
        <TextChatView />
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(MiroBoardPage);
