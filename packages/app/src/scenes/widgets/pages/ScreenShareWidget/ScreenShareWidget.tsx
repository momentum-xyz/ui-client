import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {Portal, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';

import {ScreenChoice, ScreenVideo} from './components/templates';
import * as styled from './ScreenShareWidget.styled';

const ScreenShareWidget: FC = () => {
  const {widgetsStore, agoraStore, sessionStore, mainStore} = useStore();
  const {worldStore} = mainStore;
  const {screenShareStore} = widgetsStore;
  const {agoraScreenShareStore} = agoraStore;
  const {remoteVideoTrack, localVideoTrack} = agoraScreenShareStore;

  const {t} = useTranslation();

  useEffect(() => {
    if (remoteVideoTrack) {
      const agoraUserId = remoteVideoTrack?.getUserId()?.toString();
      if (screenShareStore.screenOwnerId !== agoraUserId) {
        screenShareStore.setScreenOwner(agoraUserId);
      }
    } else if (localVideoTrack) {
      screenShareStore.setScreenOwner(sessionStore?.userId);
    } else {
      screenShareStore.setScreenOwner(null);
    }
  }, [agoraScreenShareStore, screenShareStore, remoteVideoTrack, localVideoTrack]);

  const startScreenSharing = useCallback(() => {
    agoraScreenShareStore.startScreenSharing();
  }, [agoraScreenShareStore]);

  const handleClose = () => {
    screenShareStore.dialog.close();
    if (screenShareStore.screenOwnerId === sessionStore.userId) {
      agoraScreenShareStore.close();
    }
  };

  return (
    <Portal data-testid="ScreenShareWidget-test">
      <styled.Modal className={cn(screenShareStore.isExpanded && 'expanded')}>
        <styled.HeaderElement className="left">
          <styled.Title>
            <Text
              text={worldStore.world?.name}
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
            iconName={screenShareStore.isExpanded ? 'minimise' : 'fullscreen'}
            size="medium-large"
            onClick={screenShareStore.togglePage}
            isWhite
          />

          <SvgButton iconName="close" size="medium-large" isWhite onClick={handleClose} />
        </styled.HeaderElement>
        <styled.InnerContainer>
          {!localVideoTrack && !remoteVideoTrack ? (
            <ScreenChoice
              isSettingUp={agoraScreenShareStore.isSettingUp}
              // canShare={//share permission}
              startScreenShare={startScreenSharing}
            />
          ) : (
            <ScreenVideo videoTrack={localVideoTrack ? localVideoTrack : remoteVideoTrack} />
          )}
        </styled.InnerContainer>
      </styled.Modal>
    </Portal>
  );
};

export default observer(ScreenShareWidget);
