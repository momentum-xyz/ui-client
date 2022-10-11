import {RefObject, useCallback, useState} from 'react';

import {CoordinationInterface} from '../interfaces';

import {useScroll} from './useScroll';
import {useResize} from './useResize';

const useCoordinates = (ref: RefObject<HTMLElement>, rightOffset: number, bottomOffset: number) => {
  const [coords, setCoords] = useState<CoordinationInterface>();
  const [isShown, setIsShown] = useState<boolean>(false);

  const updateCoords = useCallback(() => {
    const rect = ref?.current?.getBoundingClientRect();
    if (rect) {
      setCoords({left: rect.x - rightOffset, top: rect.y - bottomOffset, width: rect.width});
    }
  }, [bottomOffset, ref, rightOffset]);

  useScroll(ref, () => setIsShown(false));
  useResize(ref, updateCoords);

  return {coords, isShown, updateCoords, setIsShown};
};

export {useCoordinates};
