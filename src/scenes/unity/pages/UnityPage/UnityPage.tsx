import React, {FC, useEffect} from 'react';
import Unity from 'react-unity-webgl';
import {observer} from 'mobx-react-lite';

import {Portal} from 'ui-kit';
import {useStore} from 'shared/hooks';

const UnityContextCSS = {
  width: '100vw',
  height: '100vh'
};

const UnityPage: FC = () => {
  const {mainStore} = useStore();
  const {unityStore} = mainStore;
  const {unityContext} = unityStore;

  useEffect(() => {
    //unityStore.init();
  }, [unityStore]);

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
    </Portal>
  );
};

export default observer(UnityPage);
