import {FC, useEffect, useRef, useState} from 'react';

import {Odyssey3dPropsInterface} from '../../core/interfaces';

import {Odyssey3dRender} from './components';

const BabylonScene: FC<Odyssey3dPropsInterface> = (props) => {
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      setIsCanvasReady(true);
    }
  }, []);

  return (
    <>
      <canvas ref={ref} className="webgl" style={{width: '100vw', height: '100vh'}} />
      {isCanvasReady && ref.current && <Odyssey3dRender canvas={ref.current} {...props} />}
    </>
  );
};

export default BabylonScene;
