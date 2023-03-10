import {FC, memo} from 'react';
import ReactSelect, {components} from 'react-select';
import cn from 'classnames';

import {IconSvg} from '../IconSvg';

import * as styled from './Select.styled';

export interface SelectOptionInterface {
  value: string;
  label: string;
}

export interface SelectPropsInterface {
  value: string[] | string | null;
  options: SelectOptionInterface[];
  placeholder?: string;
  hideSelectedOptions: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  isDisabled?: boolean;
  wide?: boolean;
  onSingleChange?: (value: string | null) => void;
  onMultiChange?: (value: string[]) => void;
}

const Select: FC<SelectPropsInterface> = ({
  wide,
  value,
  options,
  isMulti,
  isSearchable = false,
  onSingleChange,
  onMultiChange,
  ...rest
}) => {
  return (
    <styled.Container data-testid="Select-test" className={cn(wide && 'wide')}>
      <ReactSelect
        options={options}
        isSearchable={isSearchable}
        isMulti={isMulti}
        value={
          value && Array.isArray(value)
            ? value.map((i) => options.find((opt) => opt.value === i))
            : options.find((opt) => opt.value === value)
        }
        onChange={(opts) => {
          if (Array.isArray(opts)) {
            onMultiChange?.(opts?.map((opt) => opt.value) || []);
          } else {
            onSingleChange?.(opts ? (opts as SelectOptionInterface).value : null);
          }
        }}
        components={{
          DropdownIndicator: (props) => (
            <components.DropdownIndicator {...props}>
              <IconSvg name="chevron" size="m" />
            </components.DropdownIndicator>
          ),
          IndicatorSeparator: () => null,
          ClearIndicator: () => null
        }}
        classNamePrefix="Select"
        {...rest}
      />
    </styled.Container>
  );
};

export default memo(Select);
