import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {Portal, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';

import {ScreenChoice, ScreenVideo} from './components/templates';
import * as styled from './ScreenSharePage.styled';

const ScreenSharePage: FC = () => {
  const {sessionStore, widgetsStore, agoraStore} = useStore();
  const {screenShareStore} = widgetsStore;
  // const {screenShareTitle} = screenShareStore;
  const {agoraScreenShareStore} = agoraStore;
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

  const startScreenSharing = useCallback(() => {
    agoraScreenShareStore.startScreenSharing(sessionStore.userId);
  }, [agoraScreenShareStore, sessionStore.userId]);

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
      <styled.Modal className={cn(screenShareStore.isExpanded && 'expanded')}>
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
            iconName={screenShareStore.isExpanded ? 'minimise' : 'fullscreen'}
            size="large"
            onClick={screenShareStore.togglePage}
            isWhite
          />

          <SvgButton
            iconName="close"
            size="large"
            isWhite
            onClick={screenShareStore.widget.close}
          />
        </styled.HeaderElement>
        <styled.InnerContainer>
          {!videoTrack ? (
            <ScreenChoice
              isSettingUp={agoraScreenShareStore.isSettingUp}
              // canShare={//share permission}
              startScreenShare={startScreenSharing}
            />
          ) : (
            <ScreenVideo videoTrack={videoTrack} />
          )}
        </styled.InnerContainer>
      </styled.Modal>
    </Portal>
  );
};

export default observer(ScreenSharePage);
