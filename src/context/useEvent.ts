import {useEffect} from 'react';

const pubSub: {[key: string]: Set<(notification: any) => void>} = {};

export const generateEventNotifyCallback = (eventName: string) => {
  pubSub[eventName] = new Set();

  // @ts-ignore: TODO: Refactor
  return (message) => {
    pubSub[eventName].forEach((listener) => {
      listener(message);
    });
  };
};

export const useEvent = (eventName: string, callback: (notification: any) => void) => {
  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (pubSub.hasOwnProperty(eventName)) {
      pubSub[eventName].add(callback);
      return () => {
        pubSub[eventName].delete(callback);
      };
    } else {
      throw new Error('Trying to subscribe to non existing unity event');
    }
  }, [eventName, callback]);
};
