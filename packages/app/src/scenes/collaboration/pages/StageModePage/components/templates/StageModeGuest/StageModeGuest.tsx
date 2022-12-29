import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {Button, Text, SpaceTopBar, SpacePage} from '@momentum-xyz/ui-kit';
import {generatePath} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ToastContent, Stage} from 'ui-kit';
import {
  StageModePopupQueue,
  StageModeStats
} from 'scenes/collaboration/pages/StageModePage/components';
import {ROUTES} from 'core/constants';

import * as styled from './StageModeGuest.styled';

interface PropsInterface {
  onLeaveMeeting: () => void;
}

const StageModeGuest: React.FC<PropsInterface> = ({onLeaveMeeting}) => {
  const {mainStore, collaborationStore} = useStore();
  const {agoraStore_OLD, favoriteStore} = mainStore;
  const {agoraStageModeStore, userDevicesStore} = agoraStore_OLD;
  const {spaceStore} = collaborationStore;
  const {addAwaitingPermissionPopup} = collaborationStore.stageModeStore;

  const {t} = useTranslation();

  const showSuccessStageModeRequestSubmissionToast = useCallback(() => {
    addAwaitingPermissionPopup();
  }, [addAwaitingPermissionPopup]);

  const handleUserRequest = useCallback(async () => {
    try {
      await agoraStageModeStore.requestToGoOnStage();
      showSuccessStageModeRequestSubmissionToast();
    } catch (e) {
      console.info(e);
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.joinStageRequestFailure')}
          showCloseButton
        />
      );
    }
  }, [agoraStageModeStore, showSuccessStageModeRequestSubmissionToast, t]);

  if (!spaceStore) {
    return null;
  }

  return (
    <SpacePage dataTestId="StageModeGuest-test" withMeeting>
      <SpaceTopBar
        title={spaceStore.space?.name ?? ''}
        subtitle={t('labels.stageMode')}
        isSpaceFavorite={favoriteStore.isFavorite(spaceStore.id || '')}
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.id}
        isChatOpen={false}
        toggleChat={() => {}}
        numberOfUnreadMessages={0}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        onLeave={onLeaveMeeting}
        adminLink={generatePath(ROUTES.spaceAdmin.base, {spaceId: spaceStore.id})}
        baseLink={generatePath(ROUTES.base, {spaceId: spaceStore.id})}
      >
        <styled.Actions>
          <styled.Spacer />
          {agoraStore_OLD.isStageMode && <StageModeStats />}
          {agoraStore_OLD.isStageMode &&
            agoraStageModeStore.canEnterStage &&
            !agoraStageModeStore.requestWasMadeToGoOnStage && (
              <Button
                label={t('actions.goOnStage')}
                variant="primary"
                onClick={handleUserRequest}
              />
            )}
          {agoraStore_OLD.isStageMode && agoraStageModeStore.isOnStage && (
            <Button
              label={t('actions.leaveStage')}
              variant="danger"
              onClick={async () => {
                await Promise.all([userDevicesStore.mute(), userDevicesStore.turnOffCamera()]);

                await agoraStageModeStore.leaveStage(userDevicesStore.cleanupLocalTracks);
              }}
            />
          )}
          {agoraStore_OLD.isStageMode && agoraStageModeStore.requestWasMadeToGoOnStage && (
            <Text text={t('messages.pendingRequestToGoOnStage')} size="m" />
          )}
          {agoraStore_OLD.isStageMode && agoraStageModeStore.isStageFull && (
            <Text text={t('messages.stageIsFull')} size="m" />
          )}
        </styled.Actions>
      </SpaceTopBar>
      <styled.Body>
        <styled.InnerBody>
          <styled.PopupQueueWrapper>
            <StageModePopupQueue />
          </styled.PopupQueueWrapper>
          <styled.StageModeContainer>
            {agoraStore_OLD.isStageMode ? (
              <Stage />
            ) : (
              <styled.StageModeMessageText
                text={t('messages.stageModeNotActiveGuest')}
                size="xl"
                transform="uppercase"
                align="center"
                weight="bold"
              />
            )}
          </styled.StageModeContainer>
        </styled.InnerBody>
      </styled.Body>
    </SpacePage>
  );
};

export default observer(StageModeGuest);
