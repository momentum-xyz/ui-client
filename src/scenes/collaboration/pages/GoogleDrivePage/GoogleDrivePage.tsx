import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {usePosBusEvent, useStore, useGooglePicker} from 'shared/hooks';
import {SpaceTopBar, Button, TextChat} from 'ui-kit';
import {ROUTES} from 'core/constants';

import {GoogleDocument, GoogleChoice} from './components/templates';
import * as styled from './GoogleDrivePage.styled';

const GoogleDrivePage: FC = () => {
  const {collaborationStore, mainStore, sessionStore} = useStore();
  const {space, googleDriveStore, textChatStore} = collaborationStore;
  const {googleDocument, documentTitle} = googleDriveStore;
  const {favoriteStore} = mainStore;

  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('google-drive-file-change', (id) => {
    if (space?.id === id) {
      googleDriveStore.fetchGoogleDocument(id);
    }
  });

  useEffect(() => {
    if (space) {
      googleDriveStore.fetchGoogleDocument(space.id);
    }

    return () => {
      googleDriveStore.resetModel();
    };
  }, [googleDriveStore, space]);

  const pickerCallBack = useCallback(
    async (data) => {
      const {picker} = (window as any).google;

      if (data[picker.Response.ACTION] === picker.Action.PICKED) {
        const content = data[picker.Response.DOCUMENTS][0];
        const document = {
          id: content[picker.Document.ID],
          name: content[picker.Document.NAME],
          url: content[picker.Document.URL]
        };

        if (space) {
          await googleDriveStore.enableGoogleDocument(space.id, document);
          await googleDriveStore.fetchGoogleDocument(space.id);
        }
      }
    },
    [googleDriveStore, space]
  );

  const closeDocument = useCallback(async () => {
    await googleDriveStore.disableGoogleDocument(space?.id || '');
    await googleDriveStore.fetchGoogleDocument(space?.id || '');
  }, [googleDriveStore, space?.id]);

  const {pickDocument} = useGooglePicker(pickerCallBack);

  if (!space) {
    return null;
  }

  return (
    <styled.Inner data-testid="GoogleDrivePage-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={documentTitle}
        isAdmin={space.isAdmin}
        spaceId={space?.id}
        isSpaceFavorite={favoriteStore.isFavorite(space.id)}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        isChatOpen={collaborationStore.textChatDialog.isOpen}
        toggleChat={collaborationStore.textChatDialog.toggle}
        editSpaceHidden
        onClose={() => history.push(ROUTES.base)}
      >
        {space.isAdmin && !!googleDocument?.data?.url && (
          <>
            <Button label={t('actions.changeDocument')} variant="primary" onClick={pickDocument} />
            <Button label={t('actions.cancel')} variant="danger" onClick={closeDocument} />
          </>
        )}
      </SpaceTopBar>
      <styled.Container>
        {!googleDocument?.data?.url ? (
          <GoogleChoice isAdmin={space.isAdmin} pickDocument={pickDocument} />
        ) : (
          <GoogleDocument documentUrl={googleDocument.data.url} />
        )}
        {collaborationStore.textChatDialog.isOpen && (
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

export default observer(GoogleDrivePage);
