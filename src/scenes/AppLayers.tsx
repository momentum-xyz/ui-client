import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useAuth} from 'react-oidc-context';
import {useTheme} from 'styled-components';

import {useStore} from 'shared/hooks';
import {ToastMessage} from 'ui-kit';
import {WidgetContainer} from 'scenes/widgets';

import UnityLoading from '../component/atoms/UnityLoading';
import CommunicationLayer from '../component/overlays/CommunicationLayer';
import InFlightControlLayer from '../component/overlays/InFlightControlLayer';
import LiveStreamLayer from '../component/overlays/LiveStreamLayer';
import useUnityEvent from '../context/Unity/hooks/useUnityEvent';
import UnityService from '../context/Unity/UnityService';
import VideoLayer from '../component/overlays/VideoLayer';
import MusicPlayerLayout from '../component/layout/MusicPlayer/MusicPlayerLayout';
import {StageModePopupQueueProvider} from '../context/StageMode/StageModePopupQueueContext';

const AppLayers: FC = ({children}) => {
  const theme = useTheme();
  const {
    favoriteStore,
    mainStore: {worldStore, unityStore}
  } = useStore();

  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useUnityEvent('MomentumLoaded', () => {
    console.info('MomentumLoaded');
    favoriteStore.fetchFavorites();
    UnityService.setAuthToken(auth.user?.access_token);
  });

  useUnityEvent('TeleportReady', () => {
    console.info('teleportready');
    unityStore.teleportIsReady();

    const world = UnityService.getCurrentWorld?.();

    if (world) {
      worldStore.init(world);
      setLoading(false);
    }
  });

  useUnityEvent('Error', (message: string) => {
    console.info('Unity Error handling', message);
    // signOutUser();
  });

  useUnityEvent('ExterminateUnity', () => {
    window.location.href = '/disconnect.html';
    // getConfirmation({
    //   blockInterface: true,
    //   title: 'Disconnected',
    //   message:
    //     "Momentum has been loaded in another window/tab - to continue the experience, please switch to that" +
    //     " window/tab and close this one"
    // }).then();
  });

  // if (loading && process.env.NODE_ENV === 'production')
  if (loading) {
    return (
      <div className="App">
        <UnityLoading />
      </div>
    );
  }

  return (
    <>
      <InFlightControlLayer />
      <div className="bg-dark-blue-70">
        <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} theme={theme} />
        <StageModePopupQueueProvider>
          <main id="main" className="h-screen pb-7 flex ">
            {children}
            <MusicPlayerLayout />
            <CommunicationLayer />
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
