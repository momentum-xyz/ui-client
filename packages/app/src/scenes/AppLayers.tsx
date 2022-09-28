import React, {FC, lazy} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';

import {useStore} from 'shared/hooks';
import {ToastMessage} from 'ui-kit';

const Widgets = lazy(() => import('./widgets/Widgets'));
const Meeting = lazy(() => import('./meeting/Meeting'));

interface PropsInterface {
  withUnity?: boolean;
  withMeeting?: boolean;
  withWidgets?: boolean;
}

const AppLayers: FC<PropsInterface> = ({
  children,
  withUnity = true,
  withMeeting = true,
  withWidgets = true
}) => {
  const {unityStore} = useStore().mainStore;

  const theme = useTheme();

  if (withUnity && !unityStore.isTeleportReady) {
    return <></>;
  }

  return (
    <div data-testid="AppLayers-test">
      <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} theme={theme} />
      <main id="main">
        <div className="main-content">{children}</div>
        {withMeeting && <Meeting />}
      </main>
      {withWidgets && <Widgets />}
    </div>
  );
};

export default observer(AppLayers);
