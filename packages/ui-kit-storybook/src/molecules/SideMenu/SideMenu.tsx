import {FC, memo} from 'react';
import cn from 'classnames';

import {Hexagon, MenuLabel} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './SideMenu.styled';

const TEN = 10;

type SideMenuOrientationType = 'left' | 'right';

interface SideMenuItemInterface {
  label: string;
  iconName: IconNameType;
  pinNumber?: number;
}

export interface SideMenuPropsInterface {
  sideMenuItems: SideMenuItemInterface[];
  activeIdx?: number;
  onMenuItemSelection: (idx: number) => void;
  orientation?: SideMenuOrientationType;
}

const SideMenu: FC<SideMenuPropsInterface> = ({
  sideMenuItems,
  activeIdx,
  orientation = 'right',
  onMenuItemSelection = (idx: number) => {}
}) => {
  return (
    <styled.Wrapper>
      {sideMenuItems.map((sideMenuItem, idx) => (
        <styled.MenuItemContainer
          className={cn(idx === activeIdx && 'active', orientation === 'left' && 'inverted')}
          key={sideMenuItem.label}
        >
          <styled.MenuItem
            onClick={() => onMenuItemSelection(idx)}
            className={cn(orientation === 'left' && 'inverted')}
          >
            <Hexagon type="primary" isActive={idx === activeIdx} iconName={sideMenuItem.iconName} />
            <MenuLabel text={sideMenuItem.label} type={orientation} />
            {sideMenuItem.pinNumber && (
              <styled.MenuItemNumberPin className={cn(orientation === 'left' && 'inverted')}>
                {sideMenuItem.pinNumber < TEN ? '0' : ''}
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
