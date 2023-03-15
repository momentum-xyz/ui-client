import {memo, forwardRef} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './ButtonEllipse.styled';

export interface ButtonEllipsePropsInterface {
  label: string;
  icon: IconNameType;
  size?: 'normal';
  variant?: 'primary';
  disabled?: boolean;
  onClick?: () => void;
}

const ButtonEllipse = forwardRef<HTMLButtonElement, ButtonEllipsePropsInterface>(
  ({icon, label, variant = 'primary', size = 'normal', disabled, onClick}, ref) => {
    return (
      <styled.Button
        data-testid="ButtonEllipse-test"
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(variant, size)}
      >
        <IconSvg name={icon} size="xxs" />
        <span>{label}</span>
      </styled.Button>
    );
  }
);

export default memo(ButtonEllipse);
