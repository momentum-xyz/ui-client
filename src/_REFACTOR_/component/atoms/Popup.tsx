import React, {useEffect} from 'react';

import {ReactComponent as CloseIcon} from '../../icons/close.svg';

interface PopupProps {
  className?: string;
  center?: boolean;
}

const sizeStyle = {
  s: 'text-md',
  m: 'text-xl'
};

const Popup: React.FC<PopupProps> = ({children, className, center = true}) => {
  return (
    <div
      className={`${center ? ' top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}
     fixed p-4 gradient-border bg-gradient-dark-blue-black-50 rounded backdrop-filter backdrop-blur ${
       className as string
     }`}
    >
      {children}
    </div>
  );
};

export default Popup;

interface PopupTitleProps {
  className?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
  size?: 's' | 'm';
}

export const PopupTitle: React.FC<PopupTitleProps> = ({
  children,
  className,
  size = 'm',
  icon,
  onClose
}) => {
  // @ts-ignore
  useEffect(() => {
    const unity = document.getElementById('unity-container');

    if (unity) {
      unity.style.pointerEvents = 'none';

      return () => {
        unity.style.pointerEvents = 'unset';
      };
    }
  }, []);

  return (
    <h2
      className={`${className as string} ${
        sizeStyle[size]
      } flex items-center pb-1.5 uppercase border-b-1 mb-1 font-bold border-prime-blue-20`}
      onKeyDown={(event) => event.preventDefault()}
    >
      {icon && <div className="w-2 h-2 mr-1">{icon}</div>}
      {children}{' '}
      {onClose && (
        <>
          <div className="flex-grow" />
          <button onClick={onClose}>
            <CloseIcon className="w-2 h-2 float-right inline-block filter hover:drop-shadow-white focus-within:drop-shadow-white" />
          </button>
        </>
      )}
    </h2>
  );
};
