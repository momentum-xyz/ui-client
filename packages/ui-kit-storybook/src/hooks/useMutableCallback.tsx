import {useRef, useCallback} from 'react';

export const useMutableCallback = <T extends (...args: any[]) => any>(
  callback: T
): typeof callback => {
  const ref = useRef<T | undefined>();
  ref.current = callback;

  const cbWrap = useCallback((...args: any[]) => {
    return ref.current?.(...args);
  }, []);

  return cbWrap as T;
};
