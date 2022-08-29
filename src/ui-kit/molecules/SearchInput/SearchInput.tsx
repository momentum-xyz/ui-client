import React, {FC, FormEvent, InputHTMLAttributes, useState} from 'react';
import cn from 'classnames';

import {SizeType} from 'ui-kit/types';
// import {useDebouncedCallback} from 'ui-kit/hooks';
import {Heading, IconSvg} from 'ui-kit';

import * as styled from './SearchInput.styled';

interface SearchPropsInterface extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  variantSize?: SizeType;
  delay?: number;
  onChange: (value: string) => void;
  label?: string;
  withBackground?: boolean;
  focused?: boolean;
  isCustom?: boolean;
  placeholder?: string;
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
  isCustom = false,
  placeholder,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // const debouncedChange = useDebouncedCallback((val) => onChange(val), delay);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    // debouncedChange(event.currentTarget.value);
    onChange(event.currentTarget.value);
  };

  return (
    <styled.Container
      className={cn(
        isFocused && 'focused',
        `variant-${variantSize}`,
        isCustom && 'SearchInput-custom'
      )}
    >
      {label && <Heading type="h4" align="left" label={label} transform="uppercase" isCustom />}
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
        <IconSvg name="search" size="medium" isCustom />
      </styled.InputContainer>
    </styled.Container>
  );
};

export default SearchInput;
