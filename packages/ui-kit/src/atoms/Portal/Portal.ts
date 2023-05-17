import {FC, useRef, useEffect, ReactNode} from 'react';
import {createPortal} from 'react-dom';

interface PropsInterface {
  children: ReactNode;
  parentId?: string;
  maximized?: boolean;
  className?: string;
}

const Portal: FC<PropsInterface> = ({children, className, parentId, maximized}) => {
  const domParent: HTMLElement = (parentId && document.getElementById(parentId)) || document.body;

  const domContainer = useRef<HTMLDivElement>(document.createElement('div'));
  domContainer.current.setAttribute('data-testid', 'Portal-test');
  domContainer.current.className = className || '';

  if (maximized) {
    // set flex-grow to 1 to make it fill the parent
    domContainer.current.style.flexGrow = '1';
  } else {
    // set flex-grow to 0 to make it not fill the parent
    domContainer.current.style.flexGrow = '0';
  }

  useEffect(() => {
    const element = domContainer.current;
    domParent.appendChild(element);
    return () => {
      domParent.removeChild(element);
    };
  }, [domContainer, domParent]);

  return createPortal(children, domContainer.current);
};

export default Portal;
