import React, {FC, InputHTMLAttributes} from 'react';
import cn from 'classnames';

import {SizeType, ToggleVariantType} from 'ui-kit/types';

import * as styled from './Toggle.styled';

interface PropsInterface extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  checked: boolean;
  size?: SizeType;
  onChange: (checked: boolean) => void;
  variant?: ToggleVariantType;
}

const Toggle: FC<PropsInterface> = ({
  variant = 'normal',
  size = 'normal',
  checked,
  onChange,
  ...restProps
}) => {
  return (
    <styled.Container className={cn(size)}>
      <styled.Background
        className={cn(checked ? 'on' : 'off', size, `variant-${variant}`)}
        onClick={() => onChange(!checked)}
      >
        <styled.HiddenInput {...restProps} checked={checked} readOnly type="checkbox" />
        <styled.Toggle className={cn(size, `variant-${variant}`, checked ? 'on' : 'off')} />
      </styled.Background>
    </styled.Container>
  );
};

export default Toggle;
