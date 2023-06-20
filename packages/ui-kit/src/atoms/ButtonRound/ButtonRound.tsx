import {memo, forwardRef} from 'react';
import cn from 'classnames';

import {IconSvg, IconSizeType} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './ButtonRound.styled';

export interface ButtonRoundPropsInterface {
  icon: IconNameType;
  size?: 'small' | 'normal' | 'large' | 'extra-large';
  variant?: 'primary';
  disabled?: boolean;
  isLabel?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const IconSizeMap = {
  small: 'xs',
  normal: 'm',
  large: 'xl',
  'extra-large': 'xl'
};

const ButtonRound = forwardRef<HTMLButtonElement, ButtonRoundPropsInterface>(
  ({icon, variant = 'primary', size = 'small', isLabel, disabled, isActive, onClick}, ref) => {
    return (
      <styled.Button
        data-testid="ButtonRound-test"
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(variant, size, isLabel && 'label', isActive && 'isActive')}
      >
        <IconSvg name={icon} size={IconSizeMap[size] as IconSizeType} />
      </styled.Button>
    );
  }
);

export default memo(ButtonRound);
