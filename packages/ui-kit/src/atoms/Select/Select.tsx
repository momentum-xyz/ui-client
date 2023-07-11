import ReactSelect, {components, MenuPlacement} from 'react-select';
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
  menuPlacement?: MenuPlacement;
  maxMenuHeight?: number;
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
  isClearable = false,
  multiSuffix,
  menuPlacement = 'auto',
  maxMenuHeight,
  onSingleChange,
  onMultiChange,
  ...rest
}: SelectPropsInterface<T>) => {
  return (
    <styled.Container data-testid="Select-test" className={cn(wide && 'wide')}>
      <styled.GlobalSelectStyle />

      <ReactSelect
        options={options}
        isMulti={isMulti}
        menuPosition="fixed"
        isSearchable={isSearchable}
        closeMenuOnSelect={closeMenuOnSelect}
        hideSelectedOptions={hideSelectedOptions}
        isClearable={isClearable}
        menuPlacement={menuPlacement}
        maxMenuHeight={maxMenuHeight}
        classNamePrefix="Select"
        menuPortalTarget={document.body}
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
          IndicatorSeparator: () => null,
          DropdownIndicator: (props) => (
            <components.DropdownIndicator {...props}>
              <IconSvg name="chevron" size="m" />
            </components.DropdownIndicator>
          ),
          ClearIndicator: (props) => (
            <components.ClearIndicator {...props}>
              <IconSvg name="close_large" size="s" />
            </components.ClearIndicator>
          ),
          SingleValue: (props) => {
            const option = props.selectProps.value as SelectOptionInterface<T>;
            return (
              <components.SingleValue {...props}>
                {option.icon ? (
                  <styled.LabelWithIcon>
                    <IconSvg name={option.icon} size="l" />
                    <styled.Label>{option.label}</styled.Label>
                  </styled.LabelWithIcon>
                ) : (
                  <>{option.label}</>
                )}
              </components.SingleValue>
            );
          },
          MultiValueContainer: (props) => {
            const {value} = props.selectProps;
            return (
              <components.MultiValueContainer {...props}>
                {Array.isArray(value) && `${value.length} ${multiSuffix}`}
              </components.MultiValueContainer>
            );
          },
          Option: (props) => (
            <components.Option {...props}>
              {props.data?.icon ? (
                <styled.LabelWithIcon>
                  <IconSvg name={props.data.icon} size="l" />
                  <styled.Label>{props?.data.label}</styled.Label>
                </styled.LabelWithIcon>
              ) : (
                <>{props.data?.label}</>
              )}
            </components.Option>
          )
        }}
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          }),
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
