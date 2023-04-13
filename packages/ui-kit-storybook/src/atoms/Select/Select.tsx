import ReactSelect, {components} from 'react-select';
import cn from 'classnames';

import {IconSvg} from '../IconSvg';
import {IconNameType} from '../../types';

import * as styled from './Select.styled';

export interface SelectOptionInterface<T> {
  value: T;
  label: string;
  icon?: IconNameType;
}

export interface SelectPropsInterface<T> {
  value: T[] | T | null | undefined;
  options: SelectOptionInterface<T>[];
  placeholder?: string;
  hideSelectedOptions?: boolean;
  closeMenuOnSelect?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  isDisabled?: boolean;
  wide?: boolean;
  multiSuffix?: string;
  isClearable?: boolean;
  onSingleChange?: (value: T | null) => void;
  onMultiChange?: (value: T[]) => void;
}

const Select = <T,>({
  wide,
  value,
  options,
  isMulti,
  isSearchable = false,
  hideSelectedOptions = false,
  closeMenuOnSelect = true,
  isClearable,
  multiSuffix,
  onSingleChange,
  onMultiChange,
  ...rest
}: SelectPropsInterface<T>) => {
  return (
    <styled.Container data-testid="Select-test" className={cn(wide && 'wide')}>
      <ReactSelect
        options={options}
        isMulti={isMulti}
        isSearchable={isSearchable}
        closeMenuOnSelect={closeMenuOnSelect}
        hideSelectedOptions={hideSelectedOptions}
        isClearable={isClearable}
        classNamePrefix="Select"
        value={
          value && Array.isArray(value)
            ? value.map((i) => options.find((opt) => opt.value === i))
            : options.find((opt) => opt.value === value)
        }
        onChange={(opts) => {
          if (Array.isArray(opts)) {
            onMultiChange?.(opts?.map((opt) => opt.value) || []);
          } else {
            onSingleChange?.(opts ? (opts as SelectOptionInterface<T>).value : null);
          }
        }}
        components={{
          DropdownIndicator: (props) => (
            <components.DropdownIndicator {...props}>
              <IconSvg name="chevron" size="m" />
            </components.DropdownIndicator>
          ),
          MultiValueContainer: (props) => {
            const {value} = props.selectProps;
            return (
              <components.MultiValueContainer {...props}>
                {Array.isArray(value) && `${value.length} ${multiSuffix}`}
              </components.MultiValueContainer>
            );
          },
          ClearIndicator: (props) => (
            <components.ClearIndicator {...props}>
              <IconSvg name="close_large" size="s" />
            </components.ClearIndicator>
          ),
          IndicatorSeparator: () => null
        }}
        styles={{
          dropdownIndicator: (baseStyles, state) => ({
            ...baseStyles,
            display: isClearable && state.hasValue ? 'none' : baseStyles.display
          })
        }}
        {...rest}
      />
    </styled.Container>
  );
};

export default Select;
