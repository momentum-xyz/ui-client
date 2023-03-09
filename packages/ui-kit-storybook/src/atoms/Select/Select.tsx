import {FC, memo} from 'react';
import ReactSelect from 'react-select';
import cn from 'classnames';

import * as styled from './Select.styled';

export interface SelectOptionInterface {
  value: string;
  label: string;
}

export interface SelectPropsInterface {
  options: SelectOptionInterface[];
  isMulti?: boolean;
  wide?: boolean;
}

const Select: FC<SelectPropsInterface> = ({options, isMulti, wide}) => {
  return (
    <styled.Container data-testid="Select-test" className={cn(wide && 'wide')}>
      <ReactSelect
        options={options}
        closeMenuOnSelect={!isMulti}
        isMulti={isMulti ? true : undefined}
      />
    </styled.Container>
  );
};

export default memo(Select);
