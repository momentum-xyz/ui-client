import {FC, PropsWithChildren} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {dummyUnityControl, UnityControlContextProvider} from '@momentum-xyz/sdk';

import {ToastMessage} from 'ui-kit';

import 'react-toastify/dist/ReactToastify.css';

const AppLayers: FC<PropsWithChildren> = ({children}) => {
  return (
    // <UnityControlContextProvider value={universeStore.world3dStore?.unityControlInst}>*/}
    <UnityControlContextProvider value={dummyUnityControl}>
      <main data-testid="AppLayers-test">
        <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} />
        {children}
      </main>
    </UnityControlContextProvider>
  );
};

export default observer(AppLayers);
