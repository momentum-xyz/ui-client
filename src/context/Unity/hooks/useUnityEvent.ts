import {useEffect, useRef} from 'react';

import {UnityEventType} from 'core/types';

import {UnityEventEmitter} from '../../../shared/services/unity/UnityService';

const useUnityEvent = <EventKey extends keyof UnityEventType>(
  event: EventKey,
  callback: UnityEventType[EventKey]
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
