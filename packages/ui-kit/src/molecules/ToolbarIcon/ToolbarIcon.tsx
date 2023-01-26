import React, {FC, PropsWithChildren} from 'react';
import {NavLink} from 'react-router-dom';
import cn from 'classnames';
import * as H from 'history';

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
  isActive?: (match: any | null, location: H.Location) => boolean; // TODO AK Fix this
  // isActive?: (match: match | null, location: H.Location) => boolean;
  state?: object;
  isWhite?: boolean;
  toolTipPlacement?: PlacementType;
}

const ToolbarIcon: FC<PropsWithChildren<ToolbarIconPropsInterface>> = ({
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
  isSelected,
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
            to={link}
            state={state}
            className={(p) => (p.isActive ? 'active' : undefined)}
            end={exact}
            // isActive={isActive} TODO AK Find solution for this
            onClick={onClick}
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
            isSelected={isSelected}
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
