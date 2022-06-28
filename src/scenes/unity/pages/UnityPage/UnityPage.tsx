import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useAuth} from 'react-oidc-context';
import {useTheme} from 'styled-components';
import Unity from 'react-unity-webgl';

import {useStore} from 'shared/hooks';
import {Portal, UnityLoader} from 'ui-kit';

import useUnityEvent from '../../../../context/Unity/hooks/useUnityEvent';
import UnityService from '../../../../context/Unity/UnityService';

const UnityContextCSS = {
  width: '100vw',
  height: '100vh'
};

const UnityPage: FC = () => {
  const {mainStore} = useStore();
  const {unityStore, worldStore} = mainStore;
  const {unityContext} = unityStore;

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

  if (!unityContext) {
    return <></>;
  }

  return (
    <Portal>
      <div
        className={`unity-desktop ${process.env.NODE_ENV === 'development' ? 'debug-bg' : ''}`}
        style={{position: 'absolute', top: 0}}
      >
        <Unity unityContext={unityContext} className="unity-canvas" style={UnityContextCSS} />
      </div>
      {!unityStore.isTeleportReady && <UnityLoader theme={theme} />}
    </Portal>
  );
};

export default observer(UnityPage);
