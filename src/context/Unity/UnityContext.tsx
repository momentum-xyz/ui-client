import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import Unity, {UnityContext} from 'react-unity-webgl';

type unityComponentProps = {unityContext: UnityContext};

const UnityContextCSS = {
  width: '100vw',
  height: '100vh'
};

const UnityComponent = ({unityContext}: unityComponentProps) => {
  useEffect(() => {
    ReactDOM.render(
      <React.StrictMode>
        <div
          className={`unity-desktop ${process.env.NODE_ENV === 'development' ? 'debug-bg' : ''}`}
        >
          <Unity unityContext={unityContext} className="unity-canvas" style={UnityContextCSS} />
        </div>
      </React.StrictMode>,
      document.getElementById('unity-container')
    );
    console.info('Bind unity to container');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default UnityComponent;
