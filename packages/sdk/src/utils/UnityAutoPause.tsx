import {FC, useEffect} from 'react';

import {useUnityControl} from '../hooks';

export const AutoPauseUnity: FC = () => {
  const {pause, resume} = useUnityControl();

  useEffect(() => {
    pause();
    return () => {
      resume();
    };
  }, [pause, resume]);
  return null;
};
