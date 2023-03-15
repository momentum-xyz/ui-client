import {memo, forwardRef} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './Button.styled';

export interface ButtonPropsInterface {
  label: string;
  icon?: IconNameType;
  size?: 'normal';
  variant?: 'primary' | 'secondary';
  wide?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonPropsInterface>(
  ({icon, label, variant = 'primary', size = 'normal', wide, disabled, onClick}, ref) => {
    return (
      <styled.Button
        data-testid="Button-test"
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(variant, size, wide && 'wide')}
      >
        {icon && <IconSvg name={icon} size="m" />}
        {label}
      </styled.Button>
    );
  }
);

export default memo(Button);
