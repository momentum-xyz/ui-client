import React, {FC, InputHTMLAttributes, memo} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './Input.styled';

interface PropsInterface extends PropsWithThemeInterface {
  label?: string | null;
  name?: string;
  placeholder?: string | null;
  selected?: boolean;
  disabled?: boolean;
  onChange?: (text: string) => void;
  isError?: boolean;
  errorMessage?: string | null;
  className?: string;
}

type PropsType = PropsInterface & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

const Input: FC<PropsType> = (props) => {
  const {
    theme,
    placeholder,
    label,
    name,
    selected = false,
    disabled = false,
    onChange,
    isError = false,
    errorMessage,
    required,
    className,
    ...restProps
  } = props;

  return (
    <styled.Container className={className}>
      <styled.LabelContainer>
        {!!label && (
          <styled.Label type="h4" align="left" theme={theme} label={label} transform="uppercase" />
        )}
        {required && <styled.RequiredIndicator>*</styled.RequiredIndicator>}
      </styled.LabelContainer>
      <styled.InputContainer theme={theme} className={cn(selected && 'highlighted')}>
        <input
          data-testid="Input-test"
          placeholder={placeholder}
          disabled={disabled}
          className={cn(isError && 'error')}
          onChange={(event) => onChange?.(event.target.value)}
          {...restProps}
        />
        <styled.ErrorMessage className={cn(!isError && 'none')}>{errorMessage}</styled.ErrorMessage>
      </styled.InputContainer>
    </styled.Container>
  );
};

export default memo(Input);
