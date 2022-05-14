import React, {Dispatch, FC, SetStateAction, useRef} from 'react';
import cn from 'classnames';

import {IconSvg, Text, useClickOutside} from 'ui-kit';
import {TokenItemModelInterface} from 'core/models/TokenItem';

import * as styled from './SearchPanel.styled';

interface PropsInterface {
  setFocus: Dispatch<SetStateAction<boolean>>;
  data: TokenItemModelInterface[];
  label: string;
  onClick?: (item: string, name: string) => void;
}

const SearchPanel: FC<PropsInterface> = ({setFocus, data, label, onClick}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, () => setFocus(false));

  const handleClick = () => {
    setFocus(false);
  };

  return (
    <styled.Container ref={panelRef} className={cn('hasBorder')}>
      <styled.Div className={cn(data.length >= 1 && 'hasBorder')}>
        <styled.TextItem>
          <Text text={label} size="s" />
        </styled.TextItem>
        <styled.IconItem>
          <IconSvg name="add" onClick={handleClick} />
        </styled.IconItem>
      </styled.Div>

      {data.map((item) => (
        <styled.ListItem key={item.id} onClick={() => onClick?.(item.id ?? '', item.name ?? '')}>
          {item.name && <Text text={item.name} size="s" align="left" />}
        </styled.ListItem>
      ))}
    </styled.Container>
  );
};

export default SearchPanel;
