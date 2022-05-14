import React, {FC, InputHTMLAttributes, memo} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './InputDark.styled';

interface PropsInterface extends PropsWithThemeInterface {
  isError?: boolean;
  errorMessage?: string;
  onChange?: (value: string) => void;
}

type PropsType = PropsInterface & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

const InputDark: FC<PropsType> = (props) => {
  const {onChange, isError, errorMessage, ...rest} = props;
  return (
    <styled.InputContainer data-testid="InputDark-test">
      <input
        {...rest}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(isError && 'error')}
      />
      {errorMessage && <styled.Error>{errorMessage}</styled.Error>}
    </styled.InputContainer>
  );
};

export default memo(InputDark);
