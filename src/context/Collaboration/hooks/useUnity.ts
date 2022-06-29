import {useEffect, useState} from 'react';

import {UnityService} from 'shared/services';

export const useUnityUserPosition = () => {
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    const userPos = UnityService.getUserPosition?.();
    if (userPos) {
      setUserPosition(userPos);
    }
  }, []);

  return userPosition;
};
