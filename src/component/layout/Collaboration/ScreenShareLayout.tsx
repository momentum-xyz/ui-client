import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import 'core/utils/boardsPicker.1.0.js';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import Button from '../../atoms/Button';
import Panel from '../../atoms/Panel';
import Page from '../../molucules/Page';
import {useUser} from '../../../hooks/api/useUser';

export interface WhiteBoardProps {}

// TODO: Refactor
const VideoContainer = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const {
    mainStore: {agoraStore}
  } = useStore();
  const {screenShareStore} = agoraStore;

  useEffect(() => {
    if (videoRef.current && screenShareStore.screenShare) {
      screenShareStore.screenShare?.play(videoRef.current, {
        fit: 'contain'
      });
    }
  }, [screenShareStore.screenShare]);

  return (
    <Panel padding={false} grow={true}>
      <div className="w-full h-full" ref={videoRef} />
    </Panel>
  );
};

// TODO: Refactor
const ScreenShareLayout: React.FC<WhiteBoardProps> = () => {
  const {mainStore, sessionStore, collaborationStore} = useStore();
  const {agoraStore} = mainStore;
  const {screenShareStore, stageModeStore} = agoraStore;
  const {screenShare, client} = screenShareStore;

  const [settingUp, setSettingUp] = useState(false);
  const [userId, setUserId] = useState<string | null>();

  const [user, , ,] = useUser(userId || '');

  const startScreenSharing = useCallback(() => {
    console.info('start screencast');
    setSettingUp(true);
    screenShareStore
      .startScreenShare(sessionStore.userId)
      .then(() => {
        if (!client) {
          setSettingUp(false);
        }
      })
      .catch(() => {
        setSettingUp(false);
      });
  }, [client, screenShareStore, sessionStore.userId]);

  useEffect(() => {
    if (client) {
      client.localTracks[0].on('track-ended', screenShareStore.stopScreenShare);
    }
  }, [client, screenShareStore.stopScreenShare]);

  useEffect(() => {
    console.info('start screen share', screenShare);
    if (screenShare) {
      setSettingUp(false);
      const userId = screenShare?.getUserId() as string;
      setUserId(userId.replace('ss|', ''));
    } else {
      setUserId(null);
    }
  }, [screenShare]);

  const View = useMemo(() => {
    if (screenShare) {
      return <VideoContainer />;
    } else if (settingUp) {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full items-center justify-center gap-4">
            ...preparing screen share
          </div>
        </Panel>
      );
    } else {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full items-center justify-center gap-4">
            <h2 className="font-bold">There is no one screensharing</h2>
            {(!agoraStore.spaceId || stageModeStore.isOnStage) && (
              <Button type="ghost" size="m" onClick={startScreenSharing}>
                Start screensharing
              </Button>
            )}
          </div>
        </Panel>
      );
    }
  }, [screenShare, settingUp, agoraStore.spaceId, stageModeStore.isOnStage, startScreenSharing]);

  const actions = useMemo(() => {
    if (client) {
      return (
        <Button type="ghost" size="s" onClick={screenShareStore.stopScreenShare}>
          stop screenshare
        </Button>
      );
    }
    return null;
  }, [screenShareStore.stopScreenShare, client]);

  if (!collaborationStore.space) {
    return null;
  }

  return (
    <Page
      title={collaborationStore.space.name || ''}
      subtitle={`Screenshare ${userId && user ? ' / ' + user?.name : ''}`}
      actions={actions}
      collaboration
    >
      {View}
    </Page>
  );
};

export default observer(ScreenShareLayout);
