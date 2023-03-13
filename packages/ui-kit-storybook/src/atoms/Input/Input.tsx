import {FC, memo, useRef} from 'react';
import {IMaskInput} from 'react-imask';
import cn from 'classnames';
import IMask from 'imask';

import {stringInputMask} from './Input.masks';
import * as styled from './Input.styled';

export interface InputPropsInterface {
  opts?: IMask.AnyMaskedOptions;
  value?: string | number | null;
  placeholder?: string;
  size?: 'normal' | 'small';
  disabled?: boolean;
  danger?: boolean;
  wide?: boolean;
  onChange: (value: string) => void;
}

const Input: FC<InputPropsInterface> = ({
  opts = stringInputMask,
  value,
  placeholder,
  disabled,
  danger,
  wide,
  size = 'normal',
  onChange
}) => {
  const ref = useRef(null);
  const inputRef = useRef(null);

  return (
    <styled.Container data-testid="Input-test">
      <IMaskInput
        ref={ref}
        inputRef={inputRef}
        {...opts}
        // show prefix / suffix only if value exist
        lazy={!(value || value === 0)}
        value={value || value === 0 ? `${value}` : null}
        onAccept={(_, {unmaskedValue}) => {
          onChange(unmaskedValue);
        }}
        // @ts-ignore: Typescript issues in library
        placeholder={placeholder}
        disabled={disabled}
        className={cn(size, danger && 'danger', wide && 'wide')}
      />
    </styled.Container>
  );
};

export default memo(Input);
