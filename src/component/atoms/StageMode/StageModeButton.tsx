import React from 'react';

import {ReactComponent as StageModeIcon} from '../../../images/icons/stage-mode.svg';

export interface StageModeButtonProps {
  type: 'ghost' | 'ghost-red' | 'ghost-white' | 'ghost-green';
  text: string;
  className?: string;
  onClick?: () => void;
}

const StageModeButton: React.FC<StageModeButtonProps> = ({type, text, className, onClick}) => {
  const handleClick = () => {
    onClick?.();
  };

  const backgroundColor = () => {
    switch (type) {
      case 'ghost':
        return 'bg-green-light-40';
      case 'ghost-red':
        return 'bg-red-sunset-20';
      case 'ghost-white':
        return 'bg-white-20';
      case 'ghost-green':
        return 'bg-green-light-50';
    }
  };

  const borderColor = () => {
    switch (type) {
      case 'ghost':
        return 'bg-green-light-40';
      case 'ghost-red':
        return 'border-red-sunset-80';
      case 'ghost-white':
        return 'border-white-100';
      case 'ghost-green':
        return 'border-green-light-100';
    }
  };

  const cssClass = `flex flex-row rounded border h-fit-content w-24 p-2 justify-between ${
    onClick ? 'cursor-pointer' : ''
  } ${borderColor()} ${backgroundColor()} ${className as string}`;

  return (
    <div className={cssClass} onClick={handleClick}>
      <h1 className="uppercase text-lg pr-2.8 w-max">{text}</h1>
      <StageModeIcon className="w-2" />
    </div>
  );
};

export default StageModeButton;
