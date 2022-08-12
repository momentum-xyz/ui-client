import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';

import {useStore} from 'shared/hooks';
import {ToastMessage} from 'ui-kit';
import {WidgetContainer} from 'scenes/widgets';

import LiveStreamLayer from '../_REFACTOR_/component/overlays/LiveStreamLayer';

const AppLayers: FC = ({children}) => {
  const {mainStore} = useStore();
  const {unityStore} = mainStore;

  const theme = useTheme();

  if (!unityStore.isTeleportReady) {
    return <></>;
  }

  return (
    <div data-testid="AppLayers-test">
      <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} theme={theme} />
      <main id="main" style={{height: '100vh', display: 'flex', paddingBottom: '70px'}}>
        <div className="main">{children}</div>
      </main>
      <WidgetContainer />
      <LiveStreamLayer />
    </div>
  );
};

export default observer(AppLayers);
