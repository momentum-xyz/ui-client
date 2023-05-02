import {FC, PropsWithChildren} from 'react';
import {observer} from 'mobx-react-lite';
import {dummyUnityControl, UnityControlContextProvider} from '@momentum-xyz/sdk';

const AppLayers: FC<PropsWithChildren> = ({children}) => {
  return (
    // <UnityControlContextProvider value={universeStore.world3dStore?.unityControlInst}>*/}
    <UnityControlContextProvider value={dummyUnityControl}>
      <main data-testid="AppLayers-test">{children}</main>
    </UnityControlContextProvider>
  );
};

export default observer(AppLayers);
