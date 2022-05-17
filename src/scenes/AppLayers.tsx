import React, {FC, useContext, useRef, useState} from 'react';
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
import WelcomePopup from '../component/popup/welcome/WelcomePopup';
import Modal, {ModalRef} from '../component/util/Modal';
import useUnityEvent from '../context/Unity/hooks/useUnityEvent';
import UnityService from '../context/Unity/UnityService';
import {AgoraContext} from '../context/AgoraContext';
import TutorialPopup from '../component/popup/welcome/TutorialPopup';
import VideoAndAudioSettingsPopup from '../component/popup/welcome/VideoAndAudioSettingsPopup';
import ReadyToLiftOffPopup from '../component/popup/welcome/ReadyToLiftOffPopup';
import VideoLayer from '../component/overlays/VideoLayer';
import SocialLayout from '../component/layout/SocialUI/SocialLayout';
import MusicPlayerLayout from '../component/layout/MusicPlayer/MusicPlayerLayout';

const AppLayers: FC = ({children}) => {
  const theme = useTheme();
  const {
    favoriteStore,
    mainStore: {worldStore, unityStore},
    widgetStore: {helpStore}
  } = useStore();

  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const {getMicrophoneConsent, getCameraConsent} = useContext(AgoraContext);

  const welcomeModal = useRef<ModalRef>(null);
  const tutorialModal = useRef<ModalRef>(null);
  const settingsModal = useRef<ModalRef>(null);
  const liftOffModal = useRef<ModalRef>(null);

  useUnityEvent('MomentumLoaded', () => {
    console.info('MomentumLoaded');
    favoriteStore.fetchFavorites();
    UnityService.setAuthToken(auth.user?.access_token);
    if (!localStorage.getItem('no-welcome')) {
      welcomeModal.current?.open();
      helpStore.helpDialog.open();
    }
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

        <main id="main" className="h-screen pb-7 flex ">
          {children}
          <SocialLayout />
          <MusicPlayerLayout />
          <CommunicationLayer />
        </main>

        <WidgetContainer />
      </div>

      <VideoLayer />
      <LiveStreamLayer />

      {/* TODO: Move modals to AppModals.tsx */}
      <Modal ref={welcomeModal}>
        <WelcomePopup
          onReadyToFly={() => {
            welcomeModal.current?.close();
            localStorage.setItem('no-welcome', '1');
          }}
          onQuickIntro={() => {
            welcomeModal.current?.close();
            tutorialModal.current?.open();
          }}
          onClose={() => {
            welcomeModal.current?.close();
            getMicrophoneConsent().then((consent) => {
              if (consent) {
                settingsModal.current?.open();
              }

              return getCameraConsent();
            });
          }}
        />
      </Modal>
      <Modal ref={tutorialModal}>
        <TutorialPopup
          onClose={() => {
            tutorialModal.current?.close();
          }}
          onPrevious={() => {
            tutorialModal.current?.close();
            welcomeModal.current?.open();
          }}
          onNext={() => {
            tutorialModal.current?.close();
            getMicrophoneConsent().then((consent) => {
              if (consent) {
                settingsModal.current?.open();
              }
            });
          }}
        />
      </Modal>
      <Modal ref={settingsModal}>
        <VideoAndAudioSettingsPopup
          onClose={() => {
            settingsModal.current?.close();
          }}
          onPrevious={() => {
            settingsModal.current?.close();
            tutorialModal.current?.open();
          }}
          onNext={() => {
            settingsModal.current?.close();
            liftOffModal.current?.open();
          }}
        />
      </Modal>
      <Modal ref={liftOffModal}>
        <ReadyToLiftOffPopup
          onClose={() => {
            liftOffModal.current?.close();
          }}
          onPrevious={() => {
            liftOffModal.current?.close();
            settingsModal.current?.open();
          }}
          onLiftOff={() => {
            liftOffModal.current?.close();
            localStorage.setItem('no-welcome', '1');
          }}
        />
      </Modal>
    </>
  );
};

export default observer(AppLayers);
