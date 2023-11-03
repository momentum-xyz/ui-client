import {FC, memo, useEffect, useRef} from 'react';
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
  autoFocus?: boolean;
  isSearch?: boolean;
  danger?: boolean;
  wide?: boolean;
  isClearable?: boolean;
  actionRight?: React.ReactNode;
  onChange: (value: string) => void;
  onEnter?: () => void;
}

const Input: FC<InputPropsInterface> = ({
  size = 'normal',
  opts = stringInputMask,
  value,
  placeholder,
  disabled,
  autoFocus,
  danger,
  wide,
  isSearch,
  isClearable,
  actionRight,
  onChange,
  onEnter
}) => {
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // @ts-ignore: Typescript issues in library
      inputRef.current.focus();
    }
  }, [autoFocus]);

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
        className={cn(
          size,
          danger && 'danger',
          isSearch && 'search',
          (isClearable || isSearch || !!actionRight) && 'with-action'
        )}
        onKeyPress={(event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            onEnter?.();
          }
        }}
      />

      {isClearable && (!!value || value === 0) ? (
        <styled.ActionIcon onClick={() => onChange('')}>
          <IconSvg name="close_large" size="s" />
        </styled.ActionIcon>
      ) : isSearch ? (
        <styled.ActionIcon>
          <IconSvg name="search" size="m" isWhite />
        </styled.ActionIcon>
      ) : actionRight ? (
        <styled.ActionHolder>{actionRight}</styled.ActionHolder>
      ) : null}
    </styled.Container>
  );
};

export default memo(Input);
