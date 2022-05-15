import AgoraRTC from 'agora-rtc-sdk-ng';
import {useCallback, useContext} from 'react';

import {request} from 'api/request';

import useContextAuth from '../../context/Auth/hooks/useContextAuth';
import useCollaboration from '../../context/Collaboration/hooks/useCollaboration';
import {useConfirmationDialog} from '../useConformationDialog';
import {AgoraContext} from '../../context/AgoraContext';

export const useAgoraScreenShare = () => {
  const {authState} = useContextAuth();
  const {collaborationState} = useCollaboration();
  const {appId, setScreenSharingClient, screenSharingClient} = useContext(AgoraContext);
  const {getConfirmation} = useConfirmationDialog();

  // @ts-ignore
  const startScreenCast = useCallback(async () => {
    if (collaborationState.collaborationSpace) {
      const screenClient = AgoraRTC.createClient({
        mode: collaborationState.stageMode ? 'live' : 'rtc',
        codec: 'h264'
      });

      screenClient.on('exception', (event) => {
        console.info('SCREENSHARE', event);
      });
      if (collaborationState.stageMode) {
        await screenClient.setClientRole('host');
      }

      const response = await request.get(
        window._env_.BACKEND_ENDPOINT_URL +
          `/agora/token/${collaborationState.stageMode ? 'stage-' : ''}${
            collaborationState.collaborationSpace.id
          }/screenshare`
      );

      try {
        const screenTrack = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: {
              width: {
                max: 1280
              },
              height: {
                max: 720
              },
              frameRate: {
                max: 30
              },
              bitrateMax: 2000
            }
          },
          'disable'
        );

        if (screenTrack) {
          const join = await screenClient.join(
            appId,
            collaborationState.stageMode
              ? 'stage-' + collaborationState.collaborationSpace.id
              : collaborationState.collaborationSpace.id,
            response.data,
            'ss|' + authState.subject
          );

          console.info('screenshare join', join);

          await screenClient.publish(screenTrack);
          console.info('screenshare publish', screenClient);
          setScreenSharingClient(screenClient);

          return screenClient;
        }
      } catch (e) {
        console.error('screenshare error', e);
        if (navigator.appVersion.indexOf('Mac') !== -1) {
          getConfirmation({
            title: 'Screen Sharing access',
            message:
              'To use screen sharing you wil need to give access to capture your screen in System Preferences > ' +
              'Security & Privacy > Privacy > Screen Recording. Please update your settings and restart the browser',
            confirmButton: 'OK'
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.collaborationSpace, appId, authState.subject, setScreenSharingClient]);

  const stopScreenCast = useCallback(() => {
    console.info('stop screencast');
    if (screenSharingClient) {
      screenSharingClient.localTracks.forEach((track) => {
        track.close();
      });
      screenSharingClient.leave();
      setScreenSharingClient(null);
    }
  }, [screenSharingClient, setScreenSharingClient]);

  return {startScreenCast, stopScreenCast};
};
