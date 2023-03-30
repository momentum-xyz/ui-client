import {FC, PropsWithChildren} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';
import {SectionedScreen} from '@momentum-xyz/ui-kit';
import {UnityControlContextProvider} from '@momentum-xyz/sdk';

import {useStore} from 'shared/hooks';
import {ToastMessage} from 'ui-kit';

import 'react-toastify/dist/ReactToastify.css';

const AppLayers: FC<PropsWithChildren> = ({children}) => {
  const {universeStore} = useStore();
  const theme = useTheme();

  return (
    <div data-testid="AppLayers-test">
      <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} theme={theme} />
      <UnityControlContextProvider value={universeStore.instance3DStore.unityControlInst}>
        <div id="sectioned-screen-container">
          <SectionedScreen />
        </div>
        <main id="main">
          <div className="main-content">{children}</div>
        </main>
      </UnityControlContextProvider>
    </div>
  );
};

export default observer(AppLayers);
