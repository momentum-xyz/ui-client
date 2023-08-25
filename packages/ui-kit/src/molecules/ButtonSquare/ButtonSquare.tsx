import {FC, memo} from 'react';
import cn from 'classnames';

import {IconSizeType, IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './ButtonSquare.styled';

export interface ButtonSquarePropsInterface {
  label: string;
  icon: IconNameType;
  iconSize?: IconSizeType;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const ButtonSquare: FC<ButtonSquarePropsInterface> = ({
  icon,
  iconSize = 'xll',
  label,
  isActive,
  isDisabled,
  onClick
}) => {
  return (
    <styled.ImageType
      onClick={onClick}
      disabled={isDisabled}
      className={cn(isActive && 'active')}
      data-testid="ButtonSquare-test"
    >
      <IconSvg name={icon} size={iconSize} isWhite />
      <span>{label}</span>
    </styled.ImageType>
  );
};

export default memo(ButtonSquare);
