import {FC, PropsWithChildren} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {UnityControlContextProvider} from '@momentum-xyz/sdk';

import {useStore} from 'shared/hooks';
import {ToastMessage} from 'ui-kit';

import 'react-toastify/dist/ReactToastify.css';

const AppLayers: FC<PropsWithChildren> = ({children}) => {
  const {universeStore} = useStore();

  return (
    <UnityControlContextProvider value={universeStore.instance3DStore.unityControlInst}>
      <main id="main" data-testid="AppLayers-test">
        <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} />
        <div className="main-content">{children}</div>
      </main>
    </UnityControlContextProvider>
  );
};

export default observer(AppLayers);
