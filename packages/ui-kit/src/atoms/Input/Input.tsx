import {FC, memo, useRef} from 'react';
import {IMaskInput} from 'react-imask';
import cn from 'classnames';
import IMask from 'imask';

import {IconSvg} from '../IconSvg';

import {stringInputMask} from './Input.masks';
import * as styled from './Input.styled';

export interface InputPropsInterface {
  opts?: IMask.AnyMaskedOptions;
  value?: string | number | null;
  placeholder?: string;
  size?: 'normal' | 'small';
  disabled?: boolean;
  isSearch?: boolean;
  danger?: boolean;
  wide?: boolean;
  isClearable?: boolean;
  onChange: (value: string) => void;
  onEnter?: () => void;
}

const Input: FC<InputPropsInterface> = ({
  size = 'normal',
  opts = stringInputMask,
  value,
  placeholder,
  disabled,
  danger,
  wide,
  isSearch,
  isClearable,
  onChange,
  onEnter
}) => {
  const ref = useRef(null);
  const inputRef = useRef(null);

  return (
    <styled.Container data-testid="Input-test" className={cn(wide && 'wide')}>
      <IMaskInput
        ref={ref}
        inputRef={inputRef}
        {...opts}
        // show prefix / suffix only if value exist
        lazy={!(value || value === 0)}
        value={value || value === 0 ? `${value}` : null}
        onAccept={(_, {unmaskedValue}) => {
          if (value !== unmaskedValue) {
            onChange(unmaskedValue);
          }
        }}
        // @ts-ignore: Typescript issues in library
        placeholder={placeholder}
        disabled={disabled}
        className={cn(size, danger && 'danger', isSearch && 'search')}
        onKeyPress={(event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            onEnter?.();
          }
        }}
      />

      {((isSearch && !isClearable) || (isSearch && isClearable && !value)) && (
        <styled.IconSearch>
          <IconSvg name="search" size="m" isWhite />
        </styled.IconSearch>
      )}

      {isClearable && (!!value || value === 0) && (
        <styled.IconClear onClick={() => onChange('')}>
          <IconSvg name="close_large" size="s" />
        </styled.IconClear>
      )}
    </styled.Container>
  );
};

export default memo(Input);
