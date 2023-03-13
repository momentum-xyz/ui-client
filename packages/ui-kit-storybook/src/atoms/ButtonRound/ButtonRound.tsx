import {memo, forwardRef} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './ButtonRound.styled';

export interface ButtonRoundPropsInterface {
  icon: IconNameType;
  size?: 'normal';
  variant?: 'primary';
  disabled?: boolean;
  onClick?: () => void;
}

const ButtonRound = forwardRef<HTMLButtonElement, ButtonRoundPropsInterface>(
  ({icon, variant = 'primary', size = 'normal', disabled, onClick}, ref) => {
    return (
      <styled.Button
        data-testid="ButtonRound-test"
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(variant, size)}
      >
        <IconSvg name={icon} size="s" />
      </styled.Button>
    );
  }
);

export default memo(ButtonRound);
