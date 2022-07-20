import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';
import cn from 'classnames';
import * as H from 'history';
import {match} from 'react-router';

import {
  Tooltip,
  ToolbarIconInterface,
  PropsWithThemeInterface,
  SvgButton,
  PlacementType
} from 'ui-kit';
import {SizeType} from 'ui-kit/types';

import * as styled from './ToolbarIcon.styled';

interface ToolbarIconPropsInterface extends PropsWithThemeInterface, ToolbarIconInterface {
  animate?: boolean;
  visible?: boolean;
  size?: SizeType;
  exact?: boolean;
  isActive?: (match: match | null, location: H.Location) => boolean;
  state?: object;
  isWhite?: boolean;
  toolTipPlacement?: PlacementType;
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
  isWhite = true,
  size = 'medium-large',
  toolTipPlacement = 'top',
  exact = false,
  disabled,
  isActive,
  state
}) => {
  return (
    // @ts-ignore: take a look
    <styled.StyledTransition
      show={visible}
      enter={cn(animate && 'animate')}
      leave={cn(animate && 'animate')}
      enterFrom="not-visible"
      enterTo="visible"
      leaveFrom="visible"
      leaveTo="not-visible"
    >
      <Tooltip label={title} placement={toolTipPlacement}>
        {link ? (
          <NavLink
            to={{pathname: link, state}}
            activeClassName="active"
            exact={exact}
            isActive={isActive}
          >
            {icon ? (
              <SvgButton iconName={icon} size={size} isWhite={isWhite} theme={theme}>
                {children}
              </SvgButton>
            ) : (
              <>{children}</>
            )}
          </NavLink>
        ) : icon ? (
          <SvgButton
            iconName={icon}
            size={size}
            isWhite={isWhite}
            theme={theme}
            onClick={onClick}
            disabled={disabled}
          >
            {children}
          </SvgButton>
        ) : (
          <div onClick={onClick}>{children}</div>
        )}
      </Tooltip>
    </styled.StyledTransition>
  );
};

export default ToolbarIcon;
