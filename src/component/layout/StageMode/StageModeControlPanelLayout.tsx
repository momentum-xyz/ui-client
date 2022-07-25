import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {IAgoraRTCRemoteUser} from 'agora-rtc-sdk-ng';
import {toast} from 'react-toastify';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {ToastContent, Toggle} from 'ui-kit';
import {useStore} from 'shared/hooks';

import Page from '../../molucules/Page';
import StageModeStage from '../../atoms/StageMode/StageModeStage';
import {useConfirmationDialog} from '../../../hooks/useConformationDialog';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {useUser} from '../../../hooks/api/useUser';
import Button from '../../atoms/Button';
import CONFIG from '../../../config/config';
import {ParticipantRole} from '../../../context/Collaboration/CollaborationTypes';

import StageModePopupQueueComponent from './StageModePopupQueueComponent';

const StageModeControlPanelLayout: React.FC = () => {
  const [stageStats, setStageStats] = useState<{speakers: number; audience: number}>({
    speakers: 0,
    audience: 0
  });
  const {mainStore, collaborationStore} = useStore();
  const {agoraStore} = mainStore;
  const {space} = collaborationStore;

  const [selectedRemoteUserIdForRemove, setSelectedRemoteUserIdForRemove] = useState<string | null>(
    null
  );
  const [user] = useUser(selectedRemoteUserIdForRemove as string);
  const [userToggledStageOn, setUserToggledStageOn] = useState<boolean>(false);

  const {getConfirmation} = useConfirmationDialog();

  const confirmRemoveUserFromStage = useCallback(() => {
    getConfirmation({
      blockInterface: true,
      title: 'Remove participant from stage',
      message: `Are you sure you want remove this ${user?.name as string} from stage`,
      confirmButton: 'Yes, remove from stage',
      cancelButton: 'No, cancel'
    }).then(async (result) => {
      if (result) {
        if (user?.id.data) {
          try {
            await agoraStore.kickUserOffStage(bytesToUuid(user.id.data));
            setSelectedRemoteUserIdForRemove(null);
          } catch {
            setSelectedRemoteUserIdForRemove(null);
            toast.error(
              <ToastContent
                isDanger
                headerIconName="alert"
                title={t('titles.alert')}
                text={t('messages.offStageFailure', {
                  user: user.name
                })}
                isCloseButton
              />
            );
          }
        }
      } else {
        setSelectedRemoteUserIdForRemove(null);
      }
    });
  }, [agoraStore, getConfirmation, user?.id.data, user?.name]);

  const remoteUserClicked = useCallback(
    async (remoteUser: IAgoraRTCRemoteUser, event = 'remove') => {
      if (event === 'remove') {
        setSelectedRemoteUserIdForRemove(remoteUser.uid as string);
      } else if (event === 'mute') {
        await agoraStore.muteRemoteUser(remoteUser.uid as string);
      }
    },
    [agoraStore]
  );

  useEffect(() => {
    if (selectedRemoteUserIdForRemove && user) {
      //display remove from stage confirmation when use data is collected
      confirmRemoveUserFromStage();
    }
  }, [user, selectedRemoteUserIdForRemove, confirmRemoveUserFromStage]);

  useEffect(() => {
    if (agoraStore.joinedStageMode && userToggledStageOn) {
      setUserToggledStageOn(false);
      handleEnterStage();
    }
  }, [agoraStore.joinedStageMode, userToggledStageOn]);

  const handleEnterStage = useCallback(() => {
    if (!agoraStore.canEnterStage) {
      toast.error(`The stage is full`);
      return;
    }

    agoraStore.enterStage();
  }, [agoraStore]);

  const handleLeaveStage = useCallback(() => {
    console.info('[stagemode] LEAVE STAGE');
    agoraStore.leaveStage();
  }, [agoraStore]);

  const stageModeOffMessage = () => (
    <div className="flex flex-grow z-0">
      <div className="flex-grow" />
      <p className="text-xl uppercase text-white-50 self-center text-center font-bold">
        Stage Mode has not Been Toggled <br />
        <br />
        You can toggle stage-mode, since you are a member of this space
      </p>
      <div className="flex-grow" />
    </div>
  );

  const usersOnStage = () => (
    <div className="flex flex-grow z-0">
      <div className="flex-grow" />
      <StageModeStage onRemoteUserClick={remoteUserClicked} />
      <div className="flex-grow" />
    </div>
  );

  useEffect(() => {
    const audience = agoraStore.stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.AUDIENCE_MEMBER;
    });

    const speakers = agoraStore.stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.SPEAKER;
    });

    setStageStats({
      speakers: agoraStore.isOnStage ? speakers.length + 1 : speakers.length,
      audience: agoraStore.isOnStage ? audience.length - 1 : audience.length
    });
  }, [agoraStore.stageModeUsers, agoraStore.isOnStage]);

  const actions = useMemo(() => {
    return (
      <div className="flex items-center justify-between mx-4 gap-2 flex-grow">
        <div className="flex items-center gap-1">
          <Toggle checked={agoraStore.isStageMode} onChange={agoraStore.toggleStageMode} />
          <span className="text-sm">
            {agoraStore.isStageMode ? 'Stage is active' : 'Stage is inactive. Toggle to activate.'}
          </span>
        </div>
        {agoraStore.isStageMode && (agoraStore.canEnterStage || agoraStore.isOnStage) && (
          <>
            <div className="flex items-center gap-1">
              <span>
                Speakers: {stageStats.speakers}/{CONFIG.video.MAX_STAGE_USERS}
              </span>
              <span>Audience: {stageStats.audience}</span>
            </div>
            <Button
              type={agoraStore.isOnStage ? 'ghost-red' : 'ghost'}
              onClick={agoraStore.isOnStage ? handleLeaveStage : handleEnterStage}
            >
              {agoraStore.isOnStage ? 'Leave Stage?' : 'Go on Stage?'}
            </Button>
          </>
        )}
        {agoraStore.isStageMode && !agoraStore.canEnterStage && <span>Stage is full</span>}
      </div>
    );
  }, [
    agoraStore.isStageMode,
    agoraStore.toggleStageMode,
    agoraStore.canEnterStage,
    agoraStore.isOnStage,
    stageStats.speakers,
    stageStats.audience,
    handleLeaveStage,
    handleEnterStage
  ]);

  return (
    <Page title={space.name || ''} subtitle="Stage Mode" collaboration actions={actions}>
      <div className="flex w-full">
        <div className="flex flex-col space-y-1">
          <StageModePopupQueueComponent />
        </div>
        {agoraStore.isStageMode ? usersOnStage() : stageModeOffMessage()}
      </div>
    </Page>
  );
};

export default observer(StageModeControlPanelLayout);
