import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';

import {useStore} from 'shared/hooks';
import {ToastMessage} from 'ui-kit';
import {WidgetContainer} from 'scenes/widgets';
// import {VideoPage} from 'scenes/video/pages';

import InFlightControlLayer from '../component/overlays/InFlightControlLayer';
import LiveStreamLayer from '../component/overlays/LiveStreamLayer';

import {MeetingRoomPage} from './meeting';

const AppLayers: FC = ({children}) => {
  const {mainStore} = useStore();
  const {unityStore, agoraStore} = mainStore;

  const theme = useTheme();

  if (!unityStore.isTeleportReady) {
    return <></>;
  }

  return (
    <>
      <InFlightControlLayer />
      <div className="bg-dark-blue-70">
        <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} theme={theme} />
        <main id="main" className="h-screen pb-7 flex">
          <div
            className="main-container"
            style={{
              marginRight: agoraStore.hasJoined ? '90px' : undefined
            }}
          >
            {children}
          </div>
          <MeetingRoomPage />
        </main>
        <WidgetContainer />
      </div>
      <LiveStreamLayer />
    </>
  );
};

export default observer(AppLayers);
