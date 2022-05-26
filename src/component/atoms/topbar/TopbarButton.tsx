import React, {MouseEventHandler} from 'react';
import {NavLink} from 'react-router-dom';

import Tooltip from '../Tooltip';

type TopbarButtonProps = {
  title: string;
  link?: string;
  // @ts-ignore: add types
  isActive?: (match, location) => boolean;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  state?: object;
};

const TopbarButton: React.FC<TopbarButtonProps> = ({
  children,
  isActive,
  title,
  onClick,
  link,
  state
}) => {
  if (link) {
    return (
      <Tooltip className="ml-2" direction="bottom" label={title}>
        <NavLink
          activeClassName="drop-shadow-white"
          to={{pathname: link, state}}
          isActive={isActive}
          title={title}
          onClick={onClick}
          className="h-2 w-2 filter hover:drop-shadow-white focus-within:drop-shadow-white"
        >
          {/* @ts-ignore */}
          {children}
        </NavLink>
      </Tooltip>
    );
  }

  return (
    <Tooltip className="ml-2" direction="bottom" label={title}>
      <button
        className="h-2 w-2 filter hover:drop-shadow-white focus-within:drop-shadow-white"
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default TopbarButton;
