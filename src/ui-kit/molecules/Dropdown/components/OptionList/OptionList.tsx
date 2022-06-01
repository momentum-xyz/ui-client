import React, {FC} from 'react';
import cn from 'classnames';

import {IconSvg, VariantType} from 'ui-kit';
import {SKIP_OUTSIDE_CLICK_CLASS} from 'ui-kit/hooks';
import {PropsWithThemeInterface, OptionInterface, ComponentSizeInterface} from 'ui-kit/interfaces';

import * as styled from './OptionList.styled';

interface PropsInterface extends PropsWithThemeInterface {
  variant: VariantType;
  selectedOption?: OptionInterface;
  optionList: OptionInterface[];
  onOptionSelect: (option: OptionInterface) => void;
  size?: ComponentSizeInterface;
}

const OptionList: FC<PropsInterface> = (props) => {
  const {theme, variant, selectedOption, optionList, onOptionSelect, size} = props;
  return (
    <styled.DropdownOptionsList className={cn(SKIP_OUTSIDE_CLICK_CLASS, variant)} size={size}>
      <styled.DropdownIcon className="opened">
        <IconSvg theme={theme} name="chevron" size="normal" />
      </styled.DropdownIcon>

      {optionList.map((option, index) => {
        const isSelected = selectedOption?.value === option.value;
        return (
          <styled.DropdownOption
            key={index}
            onClick={() => onOptionSelect(option)}
            className={cn(SKIP_OUTSIDE_CLICK_CLASS, {selected: isSelected})}
          >
            {option.icon && <IconSvg name={option.icon} size="normal" isCustom />} {option.label}
          </styled.DropdownOption>
        );
      })}
    </styled.DropdownOptionsList>
  );
};

export default OptionList;
