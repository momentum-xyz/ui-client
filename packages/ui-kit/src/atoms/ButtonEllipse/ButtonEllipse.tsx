import {memo, forwardRef} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './ButtonEllipse.styled';

export interface ButtonEllipsePropsInterface {
  label?: string | null;
  icon?: IconNameType;
  size?: 'normal';
  isActive?: boolean;
  isLabel?: boolean;
  variant?: 'primary' | 'secondary' | 'thirty';
  disabled?: boolean;
  wide?: boolean;
  onClick?: () => void;
}

const ButtonEllipse = forwardRef<HTMLButtonElement, ButtonEllipsePropsInterface>(
  (
    {icon, label, variant = 'primary', isActive, isLabel, size = 'normal', disabled, wide, onClick},
    ref
  ) => {
    return (
      <styled.Button
        data-testid="ButtonEllipse-test"
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          variant,
          size,
          !!icon && !label && 'only-icon',
          isActive && 'active',
          isLabel && 'label',
          wide && 'wide'
        )}
      >
        {icon && <IconSvg name={icon} size="xxs" />}
        {label && <styled.Label>{label}</styled.Label>}
      </styled.Button>
    );
  }
);

export default memo(ButtonEllipse);
