import {useEffect, useState} from 'react';

export const useDeviceChange = (callback: () => void) => {
  const [device, setDevice] = useState<MediaDeviceInfo>();
  useEffect(() => {
    navigator.mediaDevices.ondevicechange = () =>
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setDevice(devices[1]);
        callback();
      });

    return () => {
      navigator.mediaDevices.ondevicechange = null;
    };
  }, [callback]);

  return {device};
};
