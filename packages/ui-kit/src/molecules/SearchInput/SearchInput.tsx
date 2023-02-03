import React, {FC, FormEvent, InputHTMLAttributes} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';
import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './SearchInput.styled';

interface BaseInterface
  extends PropsWithThemeInterface,
    Omit<InputHTMLAttributes<any>, 'onChange'> {}

interface SearchPropsInterface extends BaseInterface {
  placeholder?: string;
  variant?: 'primary' | 'secondary';
  withBackground?: boolean;
  onChange?: (value: string) => void;
}

const SearchInput: FC<SearchPropsInterface> = ({
  variant = 'primary',
  withBackground = false,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  ...restProps
}) => {
  return (
    <styled.Container data-testid="SearchInput-test">
      <styled.Input
        placeholder={placeholder}
        onChange={(event: FormEvent<HTMLInputElement>) => {
          onChange?.(event.currentTarget.value);
        }}
        onFocus={(event) => onFocus?.(event)}
        onBlur={(event) => onBlur?.(event)}
        className={cn(variant, withBackground && 'withBackground')}
        {...restProps}
      />

      <styled.Icon className={cn(variant)}>
        <IconSvg name="search" size="medium" />
      </styled.Icon>
    </styled.Container>
  );
};

export default SearchInput;
