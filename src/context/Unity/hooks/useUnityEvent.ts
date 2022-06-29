import {useEffect, useRef} from 'react';

import {UnityEventEmitter, UnityEvents} from '../../../shared/services/unity/UnityService';

const useUnityEvent = <EventKey extends keyof UnityEvents>(
  event: EventKey,
  callback: UnityEvents[EventKey]
) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    //@ts-ignore
    const callProxy = (...args) => callbackRef.current(...args);
    UnityEventEmitter.addListener(event, callProxy);
    return () => {
      UnityEventEmitter.removeListener(event, callProxy);
    };
  }, [event]);
};

export default useUnityEvent;
