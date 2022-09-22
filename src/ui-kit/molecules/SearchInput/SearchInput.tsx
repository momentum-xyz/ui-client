import React, {FC, FormEvent, InputHTMLAttributes, useState} from 'react';
import cn from 'classnames';

import {SizeType} from 'ui-kit/types';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './SearchInput.styled';

interface SearchPropsInterface
  extends PropsWithThemeInterface,
    Omit<InputHTMLAttributes<any>, 'onChange'> {
  variantSize?: SizeType;
  delay?: number;
  onChange?: (value: string) => void;
  label?: string;
  withBackground?: boolean;
  focused?: boolean;
  placeholder?: string;
  className?: string;
}

const SearchInput: FC<SearchPropsInterface> = ({
  variantSize = 'normal',
  delay,
  label,
  withBackground = false,
  focused = false,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  className,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    onChange?.(event.currentTarget.value);
  };

  return (
    <styled.Container
      data-testid="SearchInput-test"
      className={cn(isFocused && 'focused', `variant-${variantSize}`, className)}
    >
      {label && <styled.InputHeading type="h4" align="left" label={label} transform="uppercase" />}
      <styled.InputContainer
        className={cn(withBackground && 'withBackground', focused && 'noBorder')}
      >
        <styled.Input
          className={cn(`variant-${variantSize}`)}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={(event) => {
            onFocus?.(event);
            setIsFocused(true);
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setIsFocused(false);
          }}
          {...restProps}
        />
        <styled.InputIcon name="search" size="medium" />
      </styled.InputContainer>
    </styled.Container>
  );
};

export default SearchInput;
