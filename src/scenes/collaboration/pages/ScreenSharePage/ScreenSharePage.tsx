import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpaceTopBar, Button} from 'ui-kit';

// TODO: Refactor
import TextChatView from '../../../../component/molucules/collaboration/TextChatView';

import {ScreenChoice, ScreenVideo} from './components/templates';
import * as styled from './ScreenSharePage.styled';

const ScreenSharePage: FC = () => {
  const {mainStore, sessionStore, collaborationStore} = useStore();
  const {space, screenShareStore} = collaborationStore;
  const {agoraStore, favoriteStore} = mainStore;
  const {agoraScreenShareStore, stageModeStore} = agoraStore;
  const {screenShare, client} = agoraScreenShareStore;
  const {isSettingUp, screenShareTitle} = screenShareStore;

  const {t} = useTranslation();
  const history = useHistory();

  //const [user, , ,] = useUser(userId || '');

  useEffect(() => {
    if (screenShare) {
      const agoraUserId = screenShare?.getUserId() as string;
      screenShareStore.setScreenOwnerId(agoraUserId);
      screenShareStore.setIsSettingUp(false);
    } else {
      screenShareStore.setScreenOwnerId(null);
    }
  }, [screenShare, screenShareStore]);

  const startScreenSharing = useCallback(async () => {
    screenShareStore.setIsSettingUp(true);
    await agoraScreenShareStore.startScreenShare(sessionStore.userId);
  }, [agoraScreenShareStore, sessionStore.userId, screenShareStore]);

  if (!space) {
    return null;
  }

  return (
    <styled.Inner>
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={screenShareTitle}
        isAdmin={space.isAdmin}
        spaceId={space.id}
        isSpaceFavorite={favoriteStore.isFavorite(space?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        isChatOpen={agoraStore.isChatOpen}
        toggleChat={agoraStore.toggleChat}
        onClose={() => history.push(ROUTES.base)}
      >
        {client && (
          <Button
            label={t('actions.cancel')}
            variant="danger"
            onClick={agoraScreenShareStore.stopScreenShare}
          />
        )}
      </SpaceTopBar>
      <styled.Container>
        {!agoraScreenShareStore.screenShare ? (
          <ScreenChoice
            isSettingUp={isSettingUp}
            canShare={space.isAdmin || stageModeStore.isOnStage}
            startScreenShare={startScreenSharing}
          />
        ) : (
          <ScreenVideo videoTrack={agoraScreenShareStore.screenShare} />
        )}
        <TextChatView />
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(ScreenSharePage);
