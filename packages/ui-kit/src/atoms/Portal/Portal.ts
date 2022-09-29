import {FC, useRef, useEffect, ReactNode} from 'react';
import {createPortal} from 'react-dom';

interface PropsInterface {
  children?: ReactNode;
}

const Portal: FC<PropsInterface> = (props) => {
  const domBody: HTMLElement = document.body;
  const domContainer = useRef<HTMLDivElement>(document.createElement('div'));
  domContainer.current.setAttribute('data-testid', 'Portal-test');

  useEffect(() => {
    const element = domContainer.current;
    domBody.appendChild(element);
    return () => {
      domBody.removeChild(element);
    };
  }, [domContainer, domBody]);

  return createPortal(props.children, domContainer.current);
};

export default Portal;
