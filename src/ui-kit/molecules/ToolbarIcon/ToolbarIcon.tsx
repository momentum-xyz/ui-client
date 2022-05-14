import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';
import cn from 'classnames';

import {Tooltip, ToolbarIconInterface, PropsWithThemeInterface, SvgButton} from 'ui-kit';
import {SizeType} from 'ui-kit/types';

import * as styled from './ToolbarIcon.styled';

interface ToolbarIconPropsInterface extends PropsWithThemeInterface, ToolbarIconInterface {
  animate?: boolean;
  visible?: boolean;
  size?: SizeType;
  exact?: boolean;
}

const ToolbarIcon: FC<ToolbarIconPropsInterface> = ({
  link,
  title,
  icon,
  onClick,
  theme,
  children,
  animate = false,
  visible = true,
  size = 'medium-large',
  exact = false
}) => {
  return (
    <styled.StyledTransition
      show={visible}
      enter={cn(animate && 'animate')}
      leave={cn(animate && 'animate')}
      enterFrom="not-visible"
      enterTo="visible"
      leaveFrom="visible"
      leaveTo="not-visible"
      onClick={onClick}
    >
      <Tooltip label={title} placement="top">
        {link ? (
          <NavLink to={link} activeClassName="active" exact={exact}>
            {icon ? <SvgButton iconName={icon} size={size} isWhite theme={theme} /> : children}
          </NavLink>
        ) : icon ? (
          <SvgButton iconName={icon} size={size} isWhite theme={theme} />
        ) : (
          children
        )}
      </Tooltip>
    </styled.StyledTransition>
  );
};

export default ToolbarIcon;
