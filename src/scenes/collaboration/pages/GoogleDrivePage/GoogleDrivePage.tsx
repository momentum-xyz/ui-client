import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {SpaceTopBar, Button} from 'ui-kit';

import TextChatView from '../../../../component/molucules/collaboration/TextChatView';

import {GoogleDocument, GoogleChoice} from './components/templates';
import * as styled from './GoogleDrivePage.styled';

const GoogleDrivePage: FC = () => {
  const {collaborationStore, mainStore} = useStore();
  const {spaceStore, googleDriveStore} = collaborationStore;
  const {space, isAdmin} = spaceStore;
  const {googleDocument} = googleDriveStore;
  const {favoriteStore} = mainStore;

  const {t} = useTranslation();

  return (
    <styled.Inner>
      <SpaceTopBar
        title={space?.name ?? ''}
        subtitle="Google Drive"
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.space?.id}
        isSpaceFavorite={favoriteStore.isFavorite(spaceStore.space?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        onClose={() => {}} // TODO
      >
        {isAdmin && !!googleDocument?.data?.accessLink && (
          <Button label={t('actions.changeBoard')} variant="primary" />
        )}
      </SpaceTopBar>
      <styled.Container>
        {!googleDocument?.data?.accessLink ? (
          <GoogleChoice isAdmin={isAdmin} pickBoard={() => {}} />
        ) : (
          <GoogleDocument miroUrl={googleDocument.data.accessLink} />
        )}
        <TextChatView />
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(GoogleDrivePage);
