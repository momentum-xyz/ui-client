import {RefObject, useCallback, useState} from 'react';

import {useScroll} from './useScroll';
import {useResize} from './useResize';

const OFFSET_RIGHT = 182;
const OFFSET_BOTTOM = 7;

const useUpdateCoordinates = (ref: RefObject<HTMLElement>) => {
  const [coords, setCoords] = useState({left: 0, top: 0, width: 0});
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);

  const updateCoordsOnScroll = () => {
    setIsMenuShown(false);
  };

  const updateCoords = useCallback(() => {
    const rect = ref?.current?.getBoundingClientRect();
    if (rect) {
      setCoords({left: rect.x - OFFSET_RIGHT, top: rect.y - OFFSET_BOTTOM, width: rect.width});
    }
  }, [ref]);

  useScroll(ref, updateCoordsOnScroll);
  useResize(ref, updateCoords);

  return {coords, isMenuShown, updateCoords, setIsMenuShown};
};

export {useUpdateCoordinates};
