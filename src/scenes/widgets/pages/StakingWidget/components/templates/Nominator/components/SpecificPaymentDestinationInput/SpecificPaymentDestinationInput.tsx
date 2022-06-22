import React, {Dispatch, FC, SetStateAction, useRef, useState} from 'react';
import cn from 'classnames';

import {Text, SearchInput, useClickOutside} from 'ui-kit';

import * as styled from './SpecificPaymentDestinationInput.styled';

interface AddressOptionsType {
  label: string;
  value: string;
  icon: string;
}

interface PropsInterface {
  options: AddressOptionsType[];
  onClick?: (item: any) => void;
  value: string;
  isFocused: boolean;
  setValue?: Dispatch<SetStateAction<string>>;
  search: (value: string) => void;
  onOptionSelect: () => void;
  searchInputLabel: string;
  searchInputPlaceholder: string;
  onButtonClick?: () => void;
  height?: string;
}

const SpecificPaymentDestinationInput: FC<PropsInterface> = ({
  options,
  onClick,
  isFocused,
  onOptionSelect,
  value,
  setValue,
  search,
  height = '65vh',
  searchInputLabel,
  searchInputPlaceholder,
  onButtonClick
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useClickOutside(panelRef, () => setActive(false));

  const handleChangeInput = (newValue: string) => {
    search(newValue);
    setValue?.(newValue);
  };

  return (
    <styled.SpecificPaymentDestinationInput>
      <styled.StyledSearchDiv className={cn(isFocused && 'focus')}>
        <SearchInput
          placeholder={searchInputPlaceholder}
          onChange={handleChangeInput}
          onClick={() => {
            setActive(true);
            handleChangeInput(value);
          }}
          delay={300}
          withBackground
          focused={isFocused}
          value={value}
        />
        {active && (
          <styled.Container ref={panelRef} className={cn('hasBorder')} height={height}>
            {options.map((item) => (
              <styled.ListItem key={item.value} onClick={() => onClick?.(item)}>
                <styled.TextRow>
                  <Text text={item.value} size="s" align="left" noWrap />
                </styled.TextRow>
              </styled.ListItem>
            ))}
          </styled.Container>
        )}
      </styled.StyledSearchDiv>
    </styled.SpecificPaymentDestinationInput>
  );
};

export default SpecificPaymentDestinationInput;
