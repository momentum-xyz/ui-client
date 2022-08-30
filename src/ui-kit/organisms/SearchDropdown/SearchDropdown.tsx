import React, {Dispatch, FC, SetStateAction, useRef} from 'react';
import cn from 'classnames';

import {Heading, IconSvg, Text, SearchInput, useClickOutside} from 'ui-kit';

import * as styled from './SearchDropdown.styled';

interface DataInterface {
  name: string;
  id: string;
}

interface PropsInterface {
  data?: DataInterface[];
  ButtonLabel?: string;
  onClick?: (item: any) => void;
  value: string;
  isFocused: boolean;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
  setValue?: Dispatch<SetStateAction<string>>;
  search: (value: string) => void;
  searchInputLabel: string;
  searchInputPlaceholder: string;
  onButtonClick?: () => void;
  height?: string;
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
  height = '65vh',
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
    <styled.StyledSearchContainer data-testid="SearchDropdown-test">
      <Heading
        type="h4"
        align="left"
        label={searchInputLabel}
        transform="uppercase"
        className="search-input-label"
      />
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
          <styled.Container ref={panelRef} className={cn('hasBorder')} height={height}>
            {ButtonLabel && (
              <styled.Div className={cn(data && data.length >= 1 && 'hasBorder')}>
                <styled.TextItem>
                  <Text text={ButtonLabel} size="s" />
                </styled.TextItem>
                <styled.IconItem>
                  <IconSvg name="add" onClick={onButtonClick} />
                </styled.IconItem>
              </styled.Div>
            )}

            {data &&
              data.map((item) => (
                <styled.ListItem key={item.id} onClick={() => onClick?.(item)}>
                  {item.name && (
                    <styled.TextRow>
                      <Text text={item.name} size="s" align="left" noWrap />
                    </styled.TextRow>
                  )}
                </styled.ListItem>
              ))}
          </styled.Container>
        )}
      </styled.StyledSearchDiv>
    </styled.StyledSearchContainer>
  );
};

export default SearchDropdown;
