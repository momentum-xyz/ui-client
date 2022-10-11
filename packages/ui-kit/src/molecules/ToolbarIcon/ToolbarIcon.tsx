import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';
import cn from 'classnames';
import * as H from 'history';
import {match} from 'react-router';

import {PropsWithThemeInterface, ToolbarIconInterface} from '../../interfaces';
import {PlacementType, SizeType} from '../../types';
import {SvgButton} from '../../molecules';
import {Tooltip} from '../../atoms';

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
      data-testid="ToolbarIcon-test"
      show={visible}
      enter={cn(animate && 'animate')}
      leave={cn(animate && 'animate')}
      enterFrom="not-visible"
      enterTo="visible"
      leaveFrom="visible"
      leaveTo="not-visible"
    >
      <Tooltip label={title} placement={toolTipPlacement}>
        {link && !disabled ? (
          <NavLink
            to={{pathname: link, state}}
            activeClassName="active"
            exact={exact}
            isActive={isActive}
          >
            {icon ? (
              <styled.ActiveSvgButton iconName={icon} size={size} isWhite={isWhite} theme={theme}>
                {children}
              </styled.ActiveSvgButton>
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
