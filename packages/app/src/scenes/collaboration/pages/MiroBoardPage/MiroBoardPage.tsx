import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {Button} from '@momentum/ui-kit';

import {ROUTES} from 'core/constants';
import {MiroBoardInterface} from 'api';
import {appVariables} from 'api/constants';
import {SpaceTopBar} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components/StreamChat';
import {useStore} from 'shared/hooks';

import {MiroBoard, MiroChoice} from './components/templates';
import * as styled from './MiroBoardPage.styled';

import 'core/utils/boardsPicker.1.0.js';

const MiroBoardPage: FC = () => {
  const {collaborationStore, mainStore, leaveMeetingSpace} = useStore();
  const {space, miroBoardStore, streamChatStore} = collaborationStore;
  const {miroBoard, miroBoardTitle} = miroBoardStore;
  const {favoriteStore} = mainStore;

  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (space) {
      miroBoardStore.fetchMiroBoard(space.id);
    }

    return () => {
      miroBoardStore.resetModel();
    };
  }, [miroBoardStore, space]);

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
  }, [miroBoardStore, space]);

  const closeBoard = useCallback(async () => {
    await miroBoardStore.disableMiroBoard(space?.id || '');
    await miroBoardStore.fetchMiroBoard(space?.id || '');
  }, [miroBoardStore, space?.id]);

  if (!space) {
    return null;
  }

  return (
    <styled.Inner data-testid="MiroBoardPage-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={miroBoardTitle}
        isAdmin={space.isAdmin}
        spaceId={space.id}
        isSpaceFavorite={favoriteStore.isFavorite(space?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        isChatOpen={streamChatStore.textChatDialog.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        {space.isAdmin && !!miroBoard?.data?.accessLink && (
          <>
            <Button label={t('actions.changeBoard')} variant="primary" onClick={pickBoard} />
            <Button label={t('actions.close')} variant="danger" onClick={closeBoard} />
          </>
        )}
      </SpaceTopBar>
      <styled.Container>
        {!miroBoard?.data?.accessLink ? (
          <MiroChoice isAdmin={space.isAdmin} pickBoard={pickBoard} />
        ) : (
          <MiroBoard miroUrl={miroBoard.data.accessLink} />
        )}
        {streamChatStore.textChatDialog.isOpen &&
          streamChatStore.client &&
          streamChatStore.currentChannel && (
            <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
          )}
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(MiroBoardPage);
