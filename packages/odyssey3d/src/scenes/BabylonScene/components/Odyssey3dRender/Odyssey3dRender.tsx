import {FC, memo, useCallback, useEffect, useRef} from 'react';
import * as BABYLON from '@babylonjs/core';

import {Odyssey3dPropsInterface} from '../../../../core/interfaces';
import {useObjects, useSceneCamera, useSceneLight} from '../../../../core/hooks';

interface PropsInterface extends Odyssey3dPropsInterface {
  canvas: HTMLCanvasElement;
}

const Odyssey3dRender: FC<PropsInterface> = ({canvas, objects}) => {
  const engine = useRef(new BABYLON.Engine(canvas, true));
  const scene = useRef(new BABYLON.Scene(engine.current));

  useSceneCamera(canvas, scene.current);
  useSceneLight(scene.current);
  useObjects(scene.current, objects);

  const onResizeHandler = useCallback(() => {
    engine.current.resize();
  }, []);

  useEffect(() => {
    engine.current.runRenderLoop(function () {
      scene.current.render();
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResizeHandler);
    return () => {
      window.removeEventListener('resize', onResizeHandler);
    };
  }, [onResizeHandler]);

  return <></>;
};

export default memo(Odyssey3dRender);
