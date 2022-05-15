import React, {useCallback} from 'react';
import {NavLink} from 'react-router-dom';

import {ToolbarIconInterface} from 'ui-kit';

import Tooltip from '../Tooltip';

interface PropsInterface extends ToolbarIconInterface {}

const ToolbarLink: React.FC<PropsInterface> = ({
  children,
  isActive,
  title,
  onClick,
  link,
  disabled = false
}) => {
  const handleMouseDown = useCallback((e) => {
    //block focus form landing on button and messing with the space bar
    e.preventDefault();
  }, []);

  if (link)
    {return (
      <Tooltip label={title}>
        <NavLink
          activeClassName="active"
          to={link}
          isActive={isActive}
          title={title}
          className="w-4 h-4 p-1 flex items-center justify-center filter hover:drop-shadow-white focus-within:drop-shadow-white"
        >
          {/* @ts-ignore: TODO: Refactor */}
          {children}
        </NavLink>
      </Tooltip>
    );}

  return (
    <Tooltip label={title}>
      <button
        className={`w-4 h-4 p-1 flex items-center justify-center filter hover:drop-shadow-white focus-within:drop-shadow-white ${
          disabled ? 'opacity-50' : ''
        }`}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        disabled={disabled}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default ToolbarLink;
