import {RefObject, useCallback, useEffect, useRef} from 'react';

const useResize = (ref: RefObject<HTMLElement>, onResize: (event: UIEvent) => void) => {
  const refCallback = useRef(onResize);
  refCallback.current = onResize;

  const handleOnResize = useCallback(
    (event: UIEvent) => {
      if (ref.current) {
        refCallback.current(event);
      }
    },
    [ref, refCallback]
  );

  useEffect(() => {
    window.addEventListener('resize', handleOnResize);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      window.removeEventListener('resize', handleOnResize);
    };
  }, [handleOnResize]);
};

export {useResize};
