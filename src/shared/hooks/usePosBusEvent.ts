import {useEffect, useRef} from 'react';

import {PosBusEventType} from 'core/types';
import {PosBusEventEmitter} from 'core/constants';

export const usePosBusEvent = <EventKey extends keyof PosBusEventType>(
  event: EventKey,
  callback: PosBusEventType[EventKey]
) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    //@ts-ignore
    const callProxy = (...args) => callbackRef.current(...args);
    PosBusEventEmitter.addListener(event, callProxy);
    return () => {
      PosBusEventEmitter.removeListener(event, callProxy);
    };
  }, [event]);
};
