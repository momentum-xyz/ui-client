import {useEffect, useRef} from 'react';

import {WebsocketEventEmitter, WebsocketEvents} from '../WebsocketService';

const useWebsocketEvent = <EventKey extends keyof WebsocketEvents>(
  event: EventKey,
  callback: WebsocketEvents[EventKey]
) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    //@ts-ignore
    const callProxy = (...args) => callbackRef.current(...args);
    WebsocketEventEmitter.addListener(event, callProxy);
    return () => {
      WebsocketEventEmitter.removeListener(event, callProxy);
    };
  }, [event]);
};

export default useWebsocketEvent;
