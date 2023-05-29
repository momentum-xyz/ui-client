import cn from 'classnames';

import {Hexagon, MenuLabel} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './SideMenu.styled';

const TEN = 10;

type SideMenuOrientationType = 'left' | 'right';

export interface SideMenuItemInterface<T> {
  id: T;
  label: string;
  iconName: IconNameType;
  pinNumber?: number;
}

export interface SideMenuPropsInterface<T> {
  activeId?: T;
  orientation?: SideMenuOrientationType;
  sideMenuItems: SideMenuItemInterface<T>[];
  onSelect: (id: T) => void;
}

const SideMenu = <T,>({
  activeId,
  sideMenuItems,
  orientation = 'right',
  onSelect
}: SideMenuPropsInterface<T>) => {
  return (
    <styled.Wrapper data-testid="SideMenu-test">
      {sideMenuItems.map(({id, label, iconName, pinNumber}) => (
        <styled.MenuItemContainer
          key={label}
          className={cn(id === activeId && 'active', orientation === 'left' && 'inverted')}
        >
          <styled.MenuItem
            onClick={() => onSelect(id)}
            className={cn(orientation === 'left' && 'inverted')}
          >
            <Hexagon type="menu" isActive={id === activeId} iconName={iconName} />
            <MenuLabel text={label} type={orientation} isActive={id === activeId} />
            {pinNumber && (
              <styled.MenuItemNumberPin className={cn(orientation === 'left' && 'inverted')}>
                {pinNumber < TEN ? '0' : ''}
                {pinNumber}
              </styled.MenuItemNumberPin>
            )}
          </styled.MenuItem>

          <styled.MenuItemSeparator>
            <Hexagon type="blank-small" />
          </styled.MenuItemSeparator>
        </styled.MenuItemContainer>
      ))}
    </styled.Wrapper>
  );
};

export default SideMenu;
