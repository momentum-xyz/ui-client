import {DependencyList, useEffect} from 'react';

export const useDeviceChange = (callback: () => void, deps: DependencyList = []) => {
  useEffect(() => {
    navigator.mediaDevices.ondevicechange = callback;

    return () => {
      navigator.mediaDevices.ondevicechange = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps]);
};
