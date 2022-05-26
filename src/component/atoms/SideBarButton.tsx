import React from 'react';
import {NavLink, NavLinkProps} from 'react-router-dom';

import Tooltip from './Tooltip';
require('../../styles/atoms/_side-bar-button.scss');

type Props = NavLinkProps;

function SideBarButton(props: Props) {
  const {children, title, ...restProps} = props;

  return (
    <Tooltip label={title || ''} direction="right" className="mb-1">
      <NavLink
        {...restProps}
        activeClassName="active-side-button"
        className="flex justify-center items-center w-6 h-6 p-2 rounded bg-dark-blue-100 opacity-70 backdrop-filter backdrop-blur hover:opacity-100  hover:text-white-100"
      >
        {children}
      </NavLink>
    </Tooltip>
  );
}

export default SideBarButton;
