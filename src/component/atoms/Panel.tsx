import React from 'react';

import {ReactComponent as CloseIcon} from '../../images/icons/close.svg';
import {ReactComponent as AddIcon} from '../../images/icons/add.svg';

import Button from './Button';
import TopbarButton from './topbar/TopbarButton';

interface Props {
  padding?: boolean;
  grow?: boolean;
  className?: string;
}

const Panel: React.FC<Props> = ({children, padding = true, grow = false, className}) => {
  return (
    <div
      className={`${grow ? 'h-full' : ''} ${padding ? 'p-2' : ''} ${
        className as string
      } flex flex-col w-full bg-gradient-dark-blue-black-50 rounded overflow-hidden backdrop-filter backdrop-blur`}
    >
      {children}
    </div>
  );
};

export default Panel;

interface PanelTitleProps {
  className?: string;
  onClose?: () => void;
  onAddAction?: () => void;
  addLabel?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const PanelTitle: React.FC<PanelTitleProps> = ({
  children,
  className,
  onClose,
  actionLabel,
  onAction,
  onAddAction,
  addLabel
}) => {
  return (
    <>
      <div className="flex justify-between items-center pb-1.5 border-b-1 mb-1 border-prime-blue-20">
        <h2 className={`${className as string}  font-bold text-lg uppercase`}>{children}</h2>
        {onAction && actionLabel && (
          <Button onClick={onAction} type="ghost" size="xs">
            {actionLabel}
          </Button>
        )}
        {onAddAction && addLabel && (
          <TopbarButton onClick={onAddAction} title={addLabel}>
            <AddIcon />
          </TopbarButton>
        )}
        {onClose && <CloseIcon onClick={onClose} className="w-2 h-2" />}
      </div>
    </>
  );
};

interface PanelBodyProps {
  className?: string;
  scroll?: boolean;
}

export const PanelBody: React.FC<PanelBodyProps> = ({children, className, scroll = false}) => {
  return (
    <div className={`${className as string} ${scroll ? 'overflow-x-auto' : ''} flex-grow min-h-0`}>
      {children}
    </div>
  );
};
