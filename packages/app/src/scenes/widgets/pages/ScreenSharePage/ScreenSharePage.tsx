import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {Portal, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {StreamChat} from 'scenes/collaboration/components';

import {ScreenChoice, ScreenVideo} from './components/templates';
import * as styled from './ScreenSharePage.styled';

interface PropsInterface {
  isExpanded?: boolean;
}

const ScreenSharePage: FC<PropsInterface> = ({isExpanded = true}) => {
  const {mainStore, sessionStore, widgetsStore, collaborationStore} = useStore();
  const {spaceStore, screenShareStore, streamChatStore} = collaborationStore;
  // const {screenShareTitle} = screenShareStore;
  const {agoraStore} = mainStore;
  const {agoraScreenShareStore, agoraStageModeStore} = agoraStore;
  const {videoTrack} = agoraScreenShareStore;

  const {t} = useTranslation();

  useEffect(() => {
    if (videoTrack) {
      const agoraUserId = videoTrack.getUserId()?.toString();
      if (screenShareStore.screenOwnerId !== agoraUserId) {
        screenShareStore.setScreenOwner(agoraUserId);
      }
    } else {
      screenShareStore.setScreenOwner(null);
    }
  }, [videoTrack, screenShareStore, sessionStore.userId]);

  const startScreenSharing = useCallback(async () => {
    const wasStarted: boolean = await agoraScreenShareStore.startScreenSharing(sessionStore.userId);
    if (wasStarted && spaceStore.id) {
      screenShareStore.relayScreenShare(spaceStore.id);
    }
  }, [agoraScreenShareStore, screenShareStore, sessionStore.userId, spaceStore.id]);

  // const stopScreenSharing = useCallback(() => {
  //   screenShareStore.setScreenOwner(null);
  //   agoraScreenShareStore.stopScreenSharing();
  // }, [agoraScreenShareStore, screenShareStore]);
  //
  // if (!space) {
  //   return null;
  // }

  return (
    <Portal>
      <styled.Modal className={cn(widgetsStore.screenShareStore.isExpanded && 'expanded')}>
        <styled.HeaderElement className="left">
          <styled.Title>
            <Text
              text="World Name"
              transform="uppercase"
              weight="medium"
              size="xl"
              isMultiline={false}
            />
          </styled.Title>
          <styled.SubTitle>
            <Text
              text={`/ ${t('labels.screenShare')}`}
              transform="uppercase"
              size="xl"
              isMultiline={false}
            />
          </styled.SubTitle>
        </styled.HeaderElement>
        <styled.HeaderElement className="right">
          <SvgButton
            iconName={isExpanded ? 'minimise' : 'fullscreen'}
            size="large"
            onClick={widgetsStore.screenShareStore.togglePage}
            isWhite
          />

          <SvgButton
            iconName="close"
            size="large"
            isWhite
            onClick={widgetsStore.screenShareStore.widget.close}
          />
        </styled.HeaderElement>
        <styled.InnerContainer>
          {!videoTrack ? (
            <ScreenChoice
              isSettingUp={agoraScreenShareStore.isSettingUp}
              canShare={
                (agoraStore.isStageMode && agoraStageModeStore.isOnStage) || !agoraStore.isStageMode
              }
              startScreenShare={startScreenSharing}
            />
          ) : (
            <ScreenVideo videoTrack={videoTrack} />
          )}
          {streamChatStore.isOpen && streamChatStore.client && streamChatStore.currentChannel && (
            <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
          )}
        </styled.InnerContainer>
      </styled.Modal>
    </Portal>
  );
};

export default observer(ScreenSharePage);
