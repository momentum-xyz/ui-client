import React, {FC} from 'react';
import Unity, {UnityContext} from 'react-unity-webgl';

import {Portal} from 'ui-kit';

interface PropsInterface {
  unityContext: UnityContext;
}

const UnityContextCSS = {
  width: '100vw',
  height: '100vh'
};

// TODO: Refactoring
const UnityComponent: FC<PropsInterface> = ({unityContext}) => {
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

export default UnityComponent;
