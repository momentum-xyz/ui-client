import React, {FC, InputHTMLAttributes} from 'react';
import cn from 'classnames';

import {SizeType} from 'ui-kit/types';

import * as styled from './Toggle.styled';

interface PropsInterface
  extends Omit<Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>, 'size'> {
  checked: boolean;
  size?: SizeType;
  onChange: (checked: boolean) => void;
}

const Toggle: FC<PropsInterface> = ({size = 'normal', checked, onChange, ...restProps}) => {
  return (
    <styled.Container className={cn(size)}>
      <styled.Background
        className={cn(checked ? 'on' : 'off', size)}
        onClick={() => onChange(!checked)}
      >
        <styled.HiddenInput {...restProps} checked={checked} readOnly type="checkbox" />
        <styled.Toggle className={cn(size)} />
      </styled.Background>
    </styled.Container>
  );
};

export default Toggle;
