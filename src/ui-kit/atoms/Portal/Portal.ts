import {FC, useRef, useEffect} from 'react';
import {createPortal} from 'react-dom';

const Portal: FC = ({children}) => {
  const domBody: HTMLElement = document.body;
  const domContainer = useRef<HTMLDivElement>(document.createElement('div'));
  domContainer.current.setAttribute('data-testid', 'Portal-test');

  useEffect(() => {
    domBody.appendChild(domContainer.current);
    return () => {
      domBody.removeChild(domContainer.current);
    };
  }, [domContainer, domBody]);

  return createPortal(children, domContainer.current);
};

export default Portal;
