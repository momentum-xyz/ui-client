import React from 'react';

import {ReactComponent as ExpandIcon} from '../../../images/icons/SocialNext.svg';

export interface SocialAccordionMenuProps {
  setIsOpen: (boolean) => void;
  isOpen: boolean;
}

const SocialAccordionMenu: React.FC<SocialAccordionMenuProps> = ({setIsOpen, isOpen, children}) => {
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className="flex justify-between items-center h-4 p-1 cursor-pointer text-green-light-100"
      onClick={handleClick}
    >
      <div className="font-semibold block text-base">{children}</div>
      <ExpandIcon
        className={`${isOpen ? 'rotate-[270deg]' : 'rotate-90'} hover:stroke-current w-1.6 h-1.6`}
      />
    </header>
  );
};

export default SocialAccordionMenu;
