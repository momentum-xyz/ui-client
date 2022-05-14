import React, {Dispatch, FC, SetStateAction, useRef} from 'react';
import cn from 'classnames';

import {Heading, IconSvg, Text, SearchInput, useClickOutside} from 'ui-kit';

import * as styled from './SearchDropdown.styled';

interface DataInterface {
  name: string;
  id: string;
}

interface PropsInterface {
  data: DataInterface[];
  ButtonLabel: string;
  onClick?: (item: any) => void;
  value: string;
  isFocused: boolean;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
  setValue?: Dispatch<SetStateAction<string>>;
  search: (value: string) => void;
  searchInputLabel: string;
  searchInputPlaceholder: string;
  onButtonClick: () => void;
}

const SearchDropdown: FC<PropsInterface> = ({
  data,
  ButtonLabel,
  onClick,
  isFocused,
  value,
  setIsFocused,
  setValue,
  search,
  searchInputLabel,
  searchInputPlaceholder,
  onButtonClick
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, () => setIsFocused(false));

  const handleChangeInput = (newValue: string) => {
    search(newValue);
    setValue?.(newValue);
  };

  return (
    <styled.StyledSearchContainer>
      <Heading type="h4" align="left" label={searchInputLabel} transform="uppercase" isCustom />
      <styled.StyledSearchDiv className={cn(isFocused && 'focus')}>
        <SearchInput
          placeholder={searchInputPlaceholder}
          onChange={handleChangeInput}
          onClick={() => {
            setIsFocused(!isFocused);
            handleChangeInput(value);
          }}
          delay={300}
          withBackground
          focused={isFocused}
          value={value}
        />
        {isFocused && (
          <styled.Container ref={panelRef} className={cn('hasBorder')}>
            <styled.Div className={cn(data.length >= 1 && 'hasBorder')}>
              <styled.TextItem>
                <Text text={ButtonLabel} size="s" />
              </styled.TextItem>
              <styled.IconItem>
                <IconSvg name="add" onClick={onButtonClick} />
              </styled.IconItem>
            </styled.Div>

            {data.map((item) => (
              <styled.ListItem key={item.id} onClick={() => onClick?.(item)}>
                {item.name && <Text text={item.name} size="s" align="left" />}
              </styled.ListItem>
            ))}
          </styled.Container>
        )}
      </styled.StyledSearchDiv>
    </styled.StyledSearchContainer>
  );
};

export default SearchDropdown;
