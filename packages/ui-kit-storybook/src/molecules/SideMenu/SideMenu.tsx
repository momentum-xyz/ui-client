import React, {FC, memo, useState} from 'react';
import cn from 'classnames';

import {Hexagon, MenuLabel} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './SideMenu.styled';

type SideMenuOrientation = 'left' | 'right';

interface SideMenuItemInterface {
  label: string;
  iconName: IconNameType;
  pinNumber?: number;
}

export interface SideMenuPropsInterface {
  sideMenuItems: SideMenuItemInterface[];
  activeIdx?: number;
  onMenuItemSelection: (idx: number) => void;
  orientation?: SideMenuOrientation;
}

const SideMenu: FC<SideMenuPropsInterface> = ({
  sideMenuItems,
  activeIdx,
  orientation = 'right',
  onMenuItemSelection
}) => {
  const [activeMenuItemIdx, setActiveMenuItemIdx] = useState(activeIdx || 0);

  const onClick = (idx: number) => {
    setActiveMenuItemIdx(idx);
    onMenuItemSelection(idx);
  };

  return (
    <styled.Wrapper>
      {sideMenuItems.map((sideMenuItem, idx) => (
        <styled.MenuItemContainer
          className={cn(
            idx === activeMenuItemIdx && 'active',
            orientation === 'left' && 'inverted'
          )}
          key={sideMenuItem.label}
        >
          <styled.MenuItem
            onClick={() => onClick(idx)}
            className={cn(orientation === 'left' && 'inverted')}
          >
            <Hexagon
              type="primary"
              isActive={idx === activeMenuItemIdx}
              iconName={sideMenuItem.iconName}
            />
            <MenuLabel text={sideMenuItem.label} type={orientation} />
            {sideMenuItem.pinNumber && (
              <styled.MenuItemNumberPin className={cn(orientation === 'left' && 'inverted')}>
                {sideMenuItem.pinNumber < 10 ? '0' : ''}
                {sideMenuItem.pinNumber}
              </styled.MenuItemNumberPin>
            )}
          </styled.MenuItem>

          <styled.MenuItemSeparator>
            <Hexagon type="blank" />
          </styled.MenuItemSeparator>
        </styled.MenuItemContainer>
      ))}
    </styled.Wrapper>
  );
};

export default memo(SideMenu);
