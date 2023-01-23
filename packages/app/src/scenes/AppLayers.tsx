import React, {FC, lazy} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';

import {useStore} from 'shared/hooks';
import {ToastMessage} from 'ui-kit';

import {TestnetMarkWidget} from './widgets/pages';

const Widgets = lazy(() => import('./widgets/Widgets'));

interface PropsInterface {
  renderUnity?: boolean;
}

const AppLayers: FC<PropsInterface> = (props) => {
  const {children, renderUnity = false} = props;

  const {unityStore} = useStore();
  const theme = useTheme();

  if (renderUnity && !unityStore.isUnityAvailable) {
    return <></>;
  }

  return (
    <div data-testid="AppLayers-test">
      <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} theme={theme} />
      <TestnetMarkWidget withOffset={renderUnity} />
      {renderUnity && <Widgets />}
      <main id="main">
        <div className="main-content">{children}</div>
      </main>
    </div>
  );
};

export default observer(AppLayers);
