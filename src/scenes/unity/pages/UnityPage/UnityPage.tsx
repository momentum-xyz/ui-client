import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useAuth} from 'react-oidc-context';
import {useTheme} from 'styled-components';
import Unity from 'react-unity-webgl';

import {useStore} from 'shared/hooks';
import {Portal, UnityLoader} from 'ui-kit';

// TODO: Refactoring
import useUnityEvent from '../../../../context/Unity/hooks/useUnityEvent';
import UnityService from '../../../../context/Unity/UnityService';

const UnityContextCSS = {
  width: '100vw',
  height: '100vh'
};

const UnityPage: FC = () => {
  const {mainStore, applicationLoaded} = useStore();
  const {unityStore} = mainStore;

  const theme = useTheme();
  const auth = useAuth();

  useUnityEvent('MomentumLoaded', () => {
    UnityService.setAuthToken(auth.user?.access_token);
  });

  useUnityEvent('TeleportReady', () => {
    const worldId = UnityService.getCurrentWorld?.();
    if (worldId) {
      applicationLoaded(worldId);
    }
  });

  useUnityEvent('Error', (message: string) => {
    console.info('Unity Error handling', message);
  });

  useUnityEvent('ExterminateUnity', () => {
    window.location.href = '/disconnect.html';
  });

  if (!unityStore.unityContext) {
    return <></>;
  }

  return (
    <Portal>
      <div
        className={`unity-desktop ${process.env.NODE_ENV === 'development' ? 'debug-bg' : ''}`}
        style={{position: 'absolute', top: 0}}
      >
        <Unity
          unityContext={unityStore.unityContext}
          className="unity-canvas"
          style={UnityContextCSS}
        />
      </div>
      {!unityStore.isTeleportReady && <UnityLoader theme={theme} />}
    </Portal>
  );
};

export default observer(UnityPage);
