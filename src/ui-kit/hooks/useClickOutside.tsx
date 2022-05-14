import {RefObject, useEffect, useCallback} from 'react';

export const SKIP_OUTSIDE_CLICK_CLASS = 'skip-outside-click';

const useClickOutside = (ref: RefObject<HTMLElement>, onClick: (event: Event) => void) => {
  const hasClass = (element: HTMLElement, classname: string) => {
    return element.className.split(' ').indexOf(classname) >= 0;
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as HTMLElement) &&
        !hasClass(event.target as HTMLElement, SKIP_OUTSIDE_CLICK_CLASS)
      ) {
        onClick(event);
      }
    },
    [ref, onClick]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
};

export {useClickOutside};
