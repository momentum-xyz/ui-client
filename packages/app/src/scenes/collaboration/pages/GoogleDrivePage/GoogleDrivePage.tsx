import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {Button} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore, useGooglePicker} from 'shared/hooks';
import {SpacePage, SpaceTopBar} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components';

import {GoogleDocument, GoogleChoice} from './components/templates';
import * as styled from './GoogleDrivePage.styled';

const GoogleDrivePage: FC = () => {
  const {collaborationStore, mainStore, leaveMeetingSpace} = useStore();
  const {spaceStore, googleDriveStore, streamChatStore} = collaborationStore;
  const {googleDocument, documentTitle} = googleDriveStore;
  const {favoriteStore} = mainStore;

  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (spaceStore) {
      googleDriveStore.fetchGoogleDocument(spaceStore.id);
    }

    return () => {
      googleDriveStore.resetModel();
    };
  }, [googleDriveStore, spaceStore]);

  const pickerCallBack = useCallback(
    async (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {picker} = (window as any).google;

      if (data[picker.Response.ACTION] === picker.Action.PICKED) {
        const content = data[picker.Response.DOCUMENTS][0];
        const document = {
          id: content[picker.Document.ID],
          name: content[picker.Document.NAME],
          url: content[picker.Document.URL]
        };

        if (spaceStore) {
          await googleDriveStore.enableGoogleDocument(spaceStore.id, document);
          await googleDriveStore.fetchGoogleDocument(spaceStore.id);
        }
      }
    },
    [googleDriveStore, spaceStore]
  );

  const closeDocument = useCallback(async () => {
    await googleDriveStore.disableGoogleDocument(spaceStore?.id || '');
    await googleDriveStore.fetchGoogleDocument(spaceStore?.id || '');
  }, [googleDriveStore, spaceStore?.id]);

  const {pickDocument} = useGooglePicker(pickerCallBack);

  if (!spaceStore) {
    return null;
  }

  return (
    <SpacePage dataTestId="GoogleDrivePage-test">
      <SpaceTopBar
        title={spaceStore.name ?? ''}
        subtitle={documentTitle}
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.id}
        isSpaceFavorite={favoriteStore.isFavorite(spaceStore.id)}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        isChatOpen={streamChatStore.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
        editSpaceHidden
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        {spaceStore.isAdmin && !!googleDocument?.data?.url && (
          <>
            <Button label={t('actions.changeDocument')} variant="primary" onClick={pickDocument} />
            <Button label={t('actions.close')} variant="danger" onClick={closeDocument} />
          </>
        )}
      </SpaceTopBar>
      <styled.Container>
        {!googleDocument?.data?.url ? (
          <GoogleChoice isAdmin={spaceStore.isAdmin} pickDocument={pickDocument} />
        ) : (
          <GoogleDocument documentUrl={googleDocument.data.url} />
        )}
        {streamChatStore.isOpen && streamChatStore.client && streamChatStore.currentChannel && (
          <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
        )}
      </styled.Container>
    </SpacePage>
  );
};

export default observer(GoogleDrivePage);
