import React, {ReactNode} from 'react';

import SocialAccordionMenu from '../../atoms/socialui/SocialAccordionMenu';

export interface SocialPanelProps {
  title: string;
  headerIcon?: ReactNode;
  isOpen: boolean;
  setIsOpen: (boolean) => void;
  position: 'left' | 'right';
  detailView?: ReactNode;
  fullHeight?: boolean;
}

const SocialPanel: React.FC<SocialPanelProps> = ({
  children,
  title,
  headerIcon,
  isOpen,
  setIsOpen,
  position,
  fullHeight,
  detailView
}) => (
  <div
    className={`flex flex-row top-0 py-2 space-x-2 max-h-full overflow-hidden
      ${position === 'right' ? 'right-0 mr-2' : 'left-0 ml-2'}`}
  >
    {position === 'right' && detailView}
    <div
      className={`flex flex-col rounded pointer-events-all overflow-hidden
      bg-new-blue-80 backdrop-filter backdrop-blur
      ${isOpen ? 'mb-1' : 'h-4.3'}
      ${fullHeight ? 'Online__users-full-height' : 'Online__users-max-height max-h-full'}`}
    >
      <div className="w-20 flex flex-col h-full overflow-hidden">
        <SocialAccordionMenu setIsOpen={setIsOpen} isOpen={isOpen}>
          <div className="flex items-center">
            {headerIcon && <div className="w-1.5 mr-1">{headerIcon}</div>}
            <p>{title}</p>
          </div>
        </SocialAccordionMenu>
        <div className="overflow-hidden h-full flex flex-col" style={{width: 'calc(100% + 2px)'}}>
          {children}
        </div>
      </div>
    </div>
    {position === 'left' && detailView}
  </div>
);

export default SocialPanel;
