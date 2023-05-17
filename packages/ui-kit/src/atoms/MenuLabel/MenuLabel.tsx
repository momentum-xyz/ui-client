import {FC, memo} from 'react';
import cn from 'classnames';

import * as styled from './MenuLabel.styled';

type MenuLabelType = 'left' | 'right';

export interface MenuLabelPropsInterface {
  type?: MenuLabelType;
  isActive?: boolean;
  text: string;
}

const MenuLabel: FC<MenuLabelPropsInterface> = (props) => {
  const {type = 'right', isActive = false, text, ...rest} = props;

  return (
    <styled.MenuLabel className={cn(type, isActive && 'bold')} {...rest}>
      {text}
    </styled.MenuLabel>
  );
};

export default memo(MenuLabel);
