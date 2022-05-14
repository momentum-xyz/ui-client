import React, {FC, useState} from 'react';
import {NavLink} from 'react-router-dom';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';
import {IconSvg} from 'ui-kit/index';

import * as styled from './NavigationBarItem.styled';

interface PropsInterface extends PropsWithThemeInterface {
  iconName: IconName;
  path: string;
  exact?: boolean;
}

const NavigationBarItem: FC<PropsInterface> = ({iconName, path, theme, exact = false}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <styled.Item
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      theme={theme}
      data-testid="NavigationBarItem-test"
    >
      <NavLink exact={exact} to={path} key={path} activeClassName="active" className="NavLink">
        <div className={`icon ${hovered ? 'hovered' : ''}`}>
          <IconSvg name={iconName} size="large" theme={theme} />
        </div>
      </NavLink>
    </styled.Item>
  );
};

export default NavigationBarItem;
