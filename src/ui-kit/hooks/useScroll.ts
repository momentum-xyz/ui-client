import {RefObject, useCallback, useEffect} from 'react';

const useScroll = (ref: RefObject<HTMLElement>, onScroll: () => void) => {
  const handleOnScroll = useCallback(() => {
    if (ref.current) {
      onScroll();
    }
  }, [ref, onScroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleOnScroll, true);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      window.removeEventListener('scroll', handleOnScroll, true);
    };
  }, [ref]);
};

export {useScroll};
