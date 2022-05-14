import {RefObject, useCallback, useEffect} from 'react';

const useResize = (ref: RefObject<HTMLElement>, onResize: (event: UIEvent) => void) => {
  const handleOnResize = useCallback(
    (event: UIEvent) => {
      if (ref.current) {
        onResize(event);
      }
    },
    [ref, onResize]
  );

  useEffect(() => {
    window.addEventListener('resize', handleOnResize);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      window.removeEventListener('resize', handleOnResize);
    };
  }, [ref]);
};

export {useResize};
