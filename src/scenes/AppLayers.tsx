import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useAuth} from 'react-oidc-context';
import {useTheme} from 'styled-components';

import {useStore} from 'shared/hooks';
import {UnityLoader, ToastMessage} from 'ui-kit';
import {WidgetContainer} from 'scenes/widgets';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';

import InFlightControlLayer from '../component/overlays/InFlightControlLayer';
import LiveStreamLayer from '../component/overlays/LiveStreamLayer';
import useUnityEvent from '../context/Unity/hooks/useUnityEvent';
import UnityService from '../context/Unity/UnityService';
import VideoLayer from '../component/overlays/VideoLayer';
import {StageModePopupQueueProvider} from '../context/StageMode/StageModePopupQueueContext';

import {Communication} from './communication';

const AppLayers: FC = ({children}) => {
  const {mainStore} = useStore();
  const {worldStore, unityStore} = mainStore;

  const {collaborationState} = useCollaboration();
  const theme = useTheme();
  const auth = useAuth();

  useUnityEvent('MomentumLoaded', () => {
    UnityService.setAuthToken(auth.user?.access_token);
  });

  useUnityEvent('TeleportReady', () => {
    const worldId = UnityService.getCurrentWorld?.();
    if (worldId) {
      unityStore.teleportIsReady();
      worldStore.init(worldId);
    }
  });

  useUnityEvent('Error', (message: string) => {
    console.info('Unity Error handling', message);
  });

  useUnityEvent('ExterminateUnity', () => {
    window.location.href = '/disconnect.html';
  });

  if (!unityStore.isTeleportReady) {
    return <UnityLoader />;
  }

  return (
    <>
      <InFlightControlLayer />
      <div className="bg-dark-blue-70">
        <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} theme={theme} />
        <StageModePopupQueueProvider>
          <main id="main" className="h-screen pb-7 flex">
            <div
              className="main-container"
              style={{
                marginRight:
                  collaborationState.enabled || collaborationState.stageMode ? '90px' : undefined
              }}
            >
              {children}
            </div>
            <Communication />
          </main>
        </StageModePopupQueueProvider>

        <WidgetContainer />
      </div>
      <VideoLayer />
      <LiveStreamLayer />
    </>
  );
};

export default observer(AppLayers);
