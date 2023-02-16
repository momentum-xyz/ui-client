import {RefObject, useCallback, useEffect, useRef} from 'react';

const useScroll = (ref: RefObject<HTMLElement>, onScroll: () => void) => {
  const refCallback = useRef(onScroll);
  refCallback.current = onScroll;

  const handleOnScroll = useCallback(() => {
    if (ref.current) {
      refCallback.current();
    }
  }, [ref, refCallback]);

  useEffect(() => {
    window.addEventListener('scroll', refCallback.current, true);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      window.removeEventListener('scroll', handleOnScroll, true);
    };
  }, [handleOnScroll]);
};

export {useScroll};
