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
  isLabel?: boolean;
  onClick?: () => void;
}

const ButtonRound = forwardRef<HTMLButtonElement, ButtonRoundPropsInterface>(
  ({icon, variant = 'primary', size = 'normal', isLabel, disabled, onClick}, ref) => {
    return (
      <styled.Button
        data-testid="ButtonRound-test"
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(variant, size, isLabel && 'label')}
      >
        <IconSvg name={icon} size="xs" />
      </styled.Button>
    );
  }
);

export default memo(ButtonRound);
