import {FC, useEffect} from 'react';

import {useUnityControl} from '../hooks';

export const UnityAutoTakeKeyboardControl: FC = () => {
  const {takeKeyboardControl, releaseKeyboardControl} = useUnityControl();

  useEffect(() => {
    takeKeyboardControl();
    return () => {
      releaseKeyboardControl();
    };
  }, [takeKeyboardControl, releaseKeyboardControl]);
  return null;
};
