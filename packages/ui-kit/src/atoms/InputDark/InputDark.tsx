import React, {FC, InputHTMLAttributes, memo} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './InputDark.styled';

interface PropsInterface extends PropsWithThemeInterface {
  placeholder?: string | null;
  variant?: 'primary' | 'secondary';
  isError?: boolean;
  errorMessage?: string | null;
  onChange?: (value: string) => void;
}

type PropsType = PropsInterface & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

const InputDark: FC<PropsType> = (props) => {
  const {variant = 'primary', onChange, isError, errorMessage, ...rest} = props;
  return (
    <styled.InputContainer data-testid="InputDark-test">
      <input
        {...rest}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(variant, isError && 'error')}
      />
      {isError && <styled.Error className={variant}>{errorMessage}</styled.Error>}
    </styled.InputContainer>
  );
};

export default memo(InputDark);
