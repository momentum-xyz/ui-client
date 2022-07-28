import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {SpaceTopBar, Button} from 'ui-kit';
import {ROUTES} from 'core/constants';

import TextChatView from '../../../../component/molucules/collaboration/TextChatView';

import {GoogleDocument, GoogleChoice} from './components/templates';
import * as styled from './GoogleDrivePage.styled';

const GoogleDrivePage: FC = () => {
  const {collaborationStore, mainStore} = useStore();
  const {space, googleDriveStore} = collaborationStore;
  const {googleDocument} = googleDriveStore;
  const {favoriteStore, agoraStore} = mainStore;

  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('google-drive-file-change', (id) => {
    if (space?.id === id) {
      googleDriveStore.fetchGoogleDocument(id);
    }
  });

  if (!space) {
    return null;
  }

  return (
    <styled.Inner>
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={t('labels.googleDrive')}
        isAdmin={space.isAdmin}
        spaceId={space?.id}
        isSpaceFavorite={favoriteStore.isFavorite(space.id)}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        isChatOpen={agoraStore.isChatOpen}
        toggleChat={agoraStore.toggleChat}
        editSpaceHidden
        onClose={() => history.push(ROUTES.base)}
      >
        {space.isAdmin && !!googleDocument?.data?.accessLink && (
          <Button label={t('actions.changeDocument')} variant="primary" />
        )}
      </SpaceTopBar>
      <styled.Container>
        {!googleDocument?.data?.accessLink ? (
          <GoogleChoice isAdmin={space.isAdmin} pickBoard={() => {}} />
        ) : (
          <GoogleDocument miroUrl={googleDocument.data.accessLink} />
        )}
        <TextChatView />
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(GoogleDrivePage);
