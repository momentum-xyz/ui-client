import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {MiroBoardInterface} from 'api';
import {appVariables} from 'api/constants';
import {SpaceTopBar, Button, TextChat} from 'ui-kit';
import {usePosBusEvent, useStore} from 'shared/hooks';

// TODO: Refactor
import 'core/utils/boardsPicker.1.0.js';

import {MiroBoard, MiroChoice} from './components/templates';
import * as styled from './MiroBoardPage.styled';

const MiroBoardPage: FC = () => {
  const {collaborationStore, mainStore, sessionStore} = useStore();
  const {space, miroBoardStore, textChatStore} = collaborationStore;
  const {miroBoard, miroBoardTitle} = miroBoardStore;
  const {favoriteStore} = mainStore;

  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('miro-board-change', (id) => {
    if (space?.id === id) {
      miroBoardStore.fetchMiroBoard(id);
    }
  });

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

  const handleClose = () => {
    history.push(ROUTES.base);
    textChatStore.textChatDialog.close();
  };

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
        isChatOpen={textChatStore.textChatDialog.isOpen}
        toggleChat={textChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={textChatStore.numberOfUnreadMessages}
        onClose={handleClose}
      >
        {space && !!miroBoard?.data?.accessLink && (
          <>
            <Button label={t('actions.changeBoard')} variant="primary" onClick={pickBoard} />
            <Button label={t('actions.cancel')} variant="danger" onClick={closeBoard} />
          </>
        )}
      </SpaceTopBar>
      <styled.Container>
        {!miroBoard?.data?.accessLink ? (
          <MiroChoice isAdmin={space.isAdmin} pickBoard={pickBoard} />
        ) : (
          <MiroBoard miroUrl={miroBoard.data.accessLink} />
        )}
        {textChatStore.textChatDialog.isOpen && (
          <TextChat
            currentChannel={textChatStore.currentChannel}
            userId={sessionStore.userId}
            sendMessage={textChatStore.sendMessage}
            messages={textChatStore.messages}
            messageSent={textChatStore.messageSent}
          />
        )}
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(MiroBoardPage);
