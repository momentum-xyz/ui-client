import React, {FC, useEffect, useRef, useState} from 'react';
import cn from 'classnames';

import {IconSvg, Portal, ValueType, VariantType, DropdownSizeType} from 'ui-kit';
import {useClickOutside, useResize, useScroll} from 'ui-kit/hooks';
import {PropsWithThemeInterface, OptionInterface} from 'ui-kit/interfaces';

import {OptionList, SelectedValue, ValueContainer} from './components';
import * as styled from './Dropdown.styled';

interface PropsInterface extends PropsWithThemeInterface {
  placeholder: string;
  value?: string | null;
  valueType?: ValueType;
  variant?: VariantType;
  options: OptionInterface[];
  onOptionSelect: (option: OptionInterface) => void | Promise<void>;
  isError?: boolean;
  dropdownSize?: DropdownSizeType;
  isDisabled?: boolean;
}

const Dropdown: FC<PropsInterface> = ({
  placeholder,
  value,
  valueType = 'string',
  theme,
  options = [],
  onOptionSelect,
  isDisabled = false,
  variant = 'primary',
  isError,
  dropdownSize = 'normal'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<OptionInterface | undefined>();
  const [coords, setCoords] = useState({});

  const ref = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === value));
  }, [value, options]);

  const handleOptionSelect = (option: OptionInterface) => {
    setSelectedOption(option);
    onOptionSelect(option);
    setIsOpen(false);
  };

  const updateTooltipCoords = () => {
    const rect = ref?.current?.getBoundingClientRect();
    if (rect) {
      setCoords({left: rect.x, top: rect.y, width: rect.width});
    }
  };

  const handleContainerClick = () => {
    if (!isDisabled) {
      updateTooltipCoords();
      setIsOpen(!isOpen);
    }
  };

  useClickOutside(optionsRef, () => setIsOpen(false));
  useScroll(ref, updateTooltipCoords);
  useResize(ref, updateTooltipCoords);

  return (
    <styled.Dropdown ref={ref} className={cn(isError && 'error')} data-testid="Dropdown-test">
      <ValueContainer
        theme={theme}
        variant={variant}
        isDisabled={isDisabled}
        onClick={handleContainerClick}
      >
        <SelectedValue valueType={valueType} placeholder={placeholder} selected={selectedOption} />
        <styled.DropdownIcon className={cn({opened: isOpen})}>
          <IconSvg theme={theme} name="chevron" size="normal" />
        </styled.DropdownIcon>
      </ValueContainer>
      {isOpen && (
        <Portal>
          <styled.Options ref={optionsRef} style={{...coords}}>
            <OptionList
              variant={variant}
              optionList={options}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
              size={dropdownSize}
            />
          </styled.Options>
        </Portal>
      )}
    </styled.Dropdown>
  );
};

export default Dropdown;
