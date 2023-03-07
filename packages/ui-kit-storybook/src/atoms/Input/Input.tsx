import {FC, memo, useEffect} from 'react';
import {useIMask} from 'react-imask';
import cn from 'classnames';
import IMask from 'imask';

import * as styled from './Input.styled';

export interface InputPropsInterface {
  opts: IMask.AnyMaskedOptions;
  defaultValue?: string | number | null;
  placeholder?: string;
  size?: 'normal' | 'small';
  disabled?: boolean;
  danger?: boolean;
  wide?: boolean;
  onChange: (value: string) => void;
}

const Input: FC<InputPropsInterface> = ({
  opts,
  defaultValue,
  placeholder,
  disabled,
  danger,
  wide,
  size = 'normal',
  onChange
}) => {
  const {ref, maskRef, setUnmaskedValue} = useIMask(opts, {
    onAccept: (value, mask) => {
      console.log(mask.unmaskedValue);
      onChange(mask.unmaskedValue);
    }
  });

  // @ts-ignore
  console.log(maskRef.current?.masked?.lazy);

  useEffect(() => {
    setUnmaskedValue(defaultValue || defaultValue === 0 ? `${defaultValue}` : '');
  }, [defaultValue, setUnmaskedValue]);

  return (
    <styled.Container data-testid="Input-test">
      <input
        ref={ref}
        defaultValue={defaultValue || undefined}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(size, danger && 'danger', wide && 'wide')}
      />
    </styled.Container>
  );
};

export default memo(Input);
