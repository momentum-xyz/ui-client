import React, {FC, useState} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';
import {IconSvg} from 'ui-kit/index';

import * as styled from './NavigationBarItem.styled';

interface PropsInterface extends PropsWithThemeInterface {
  iconName: IconName;
  path: string;
  exact?: boolean;
  replace?: boolean;
  state?: object;
  isActive?: boolean;
  isHidden?: boolean;
}

const NavigationBarItem: FC<PropsInterface> = ({
  iconName,
  path,
  theme,
  exact = false,
  replace = false,
  isActive = false,
  isHidden = false,
  state
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <styled.Item
      className={cn(isHidden && 'isHidden')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      theme={theme}
      data-testid="NavigationBarItem-test"
    >
      <styled.StyledNavLink
        exact={exact}
        to={{pathname: path, state}}
        key={path}
        activeClassName="active"
        replace={replace}
      >
        <div className={cn('icon', isActive && 'isActive', hovered && 'hovered')}>
          <IconSvg name={iconName} size="large" theme={theme} />
        </div>
      </styled.StyledNavLink>
    </styled.Item>
  );
};

export default NavigationBarItem;
