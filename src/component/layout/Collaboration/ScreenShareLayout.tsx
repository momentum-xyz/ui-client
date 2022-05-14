import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';

import {AgoraContext} from '../../../context/AgoraContext';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {useAgoraScreenShare} from '../../../hooks/communication/useAgoraScreenShare';
import 'core/utils/boardsPicker.1.0.js';
import Button from '../../atoms/Button';
import Panel from '../../atoms/Panel';
import Page from '../../molucules/Page';
import {useUser} from '../../../hooks/api/useUser';
import {useAgoraStageMode} from '../../../hooks/communication/useAgoraStageMode';

export interface WhiteBoardProps {}

const ScreenShareLayout: React.FC<WhiteBoardProps> = () => {
  const {screenShare, screenSharingClient} = useContext(AgoraContext);
  const {collaborationState} = useCollaboration();
  const {startScreenCast, stopScreenCast} = useAgoraScreenShare();

  const [settingUp, setSettingUp] = useState(false);
  const [userId, setUserId] = useState<string | null>();

  const [user, , ,] = useUser(userId || '');
  const {isOnStage} = useAgoraStageMode();

  const VideoContainer = () => {
    const {screenShare} = useContext(AgoraContext);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (videoRef.current && screenShare) {
        screenShare.play(videoRef.current, {
          fit: 'contain'
        });
      }
    }, [screenShare]);

    return (
      <Panel padding={false} grow={true}>
        <div className="w-full h-full" ref={videoRef} />
      </Panel>
    );
  };

  const startScreenSharing = useCallback(() => {
    console.info('start screencast');
    setSettingUp(true);
    startScreenCast()
      .then((client) => {
        console.info('=> client', client);
        if (!client) setSettingUp(false);
      })
      .catch(() => {
        setSettingUp(false);
      });
  }, [startScreenCast]);

  useEffect(() => {
    if (screenSharingClient) {
      console.info('SCREENSHARING CLIENT:', screenSharingClient);
      screenSharingClient.localTracks[0].on('track-ended', stopScreenCast);
    }
  }, [screenSharingClient]);

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
            {(!collaborationState.stageMode || isOnStage) && (
              <Button type="ghost" size="m" onClick={startScreenSharing}>
                Start screensharing
              </Button>
            )}
          </div>
        </Panel>
      );
    }
  }, [screenShare, settingUp, startScreenSharing]);

  const actions = useMemo(() => {
    if (screenSharingClient)
      return (
        <Button type="ghost" size="s" onClick={stopScreenCast}>
          stop screenshare
        </Button>
      );
    return null;
  }, [screenSharingClient, stopScreenCast]);

  return (
    <Page
      title={collaborationState.collaborationSpace?.name || ''}
      subtitle={`Screenshare ${userId && user ? ' / ' + user?.name : ''}`}
      actions={actions}
      collaboration
    >
      {View}
    </Page>
  );
};

export default ScreenShareLayout;
