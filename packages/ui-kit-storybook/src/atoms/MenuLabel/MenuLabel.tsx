import {FC, memo} from 'react';
import cn from 'classnames';

import * as styled from './MenuLabel.styled';

type MenuLabelType = 'left' | 'bold-left' | 'right' | 'bold-right';
const leftFacingMenuLabelTypes: MenuLabelType[] = ['left', 'bold-left'];
const boldMenuLabelTypes: MenuLabelType[] = ['bold-left', 'bold-right'];

export interface MenuLabelPropsInterface {
  type?: MenuLabelType;
  text: string;
}

const MenuLabel: FC<MenuLabelPropsInterface> = (props) => {
  const {type = 'right', text, ...rest} = props;

  const direction = leftFacingMenuLabelTypes.includes(type) ? 'left' : 'right';
  const isBold = boldMenuLabelTypes.includes(type);

  return (
    <styled.MenuLabel className={cn(direction, isBold && 'bold')} {...rest}>
      {text}
    </styled.MenuLabel>
  );
};

export default memo(MenuLabel);
