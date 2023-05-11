import {FC} from 'react';
import {observer} from 'mobx-react-lite';

const ScreenShareWidget: FC = () => {
  /*const {widgetsStore, agoraStore, sessionStore, universeStore} = useStore();
  const {world2dStore} = universeStore;
  const {screenShareStore} = widgetsStore;
  const {agoraScreenShareStore} = agoraStore;
  const {remoteVideoTrack, localVideoTrack} = agoraScreenShareStore;

  const {t} = useI18n();

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
    <SectionedScreenPortal
      data-testid="ScreenShareWidget-test"
      section={
        screenShareStore.isExpanded ? ScreenSectionsEnum.TOP_LEFT : ScreenSectionsEnum.BOTTOM_RIGHT
      }
      maximized={screenShareStore.isExpanded}
    >
      <WindowPanel
        title={world2dStore?.info?.name || ''}
        subtitle={t('labels.screenShare') || ''}
        initialIsExpanded={screenShareStore.isExpanded}
        onToggleExpand={screenShareStore.togglePage}
        onClose={handleClose}
      >
        {!localVideoTrack && !remoteVideoTrack ? (
          <ScreenChoice
            isSettingUp={agoraScreenShareStore.isSettingUp}
            // canShare={//share permission}
            startScreenShare={startScreenSharing}
          />
        ) : (
          <ScreenVideo videoTrack={localVideoTrack ? localVideoTrack : remoteVideoTrack} />
        )}
      </WindowPanel>
    </SectionedScreenPortal>
  );*/

  return <></>;
};

export default observer(ScreenShareWidget);
