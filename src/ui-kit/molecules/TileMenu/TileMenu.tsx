import React, {FC} from 'react';
import {DraggableProvided} from 'react-beautiful-dnd';

import {SvgButton} from 'ui-kit';

import * as styled from './TileMenu.styled';

interface PropsInterface {
  onEdit: () => void;
  onDelete: () => void;
  provided?: DraggableProvided;
  isDelete: boolean;
}

const TileMenu: FC<PropsInterface> = ({onEdit, onDelete, provided, isDelete}) => {
  return (
    <styled.Container>
      {isDelete && <SvgButton iconName="trash" size="normal" onClick={onDelete} isWhite />}
      <SvgButton iconName="pencil" size="normal" onClick={onEdit} isWhite />
      <SvgButton iconName="direction-arrows" size="normal" isWhite {...provided?.dragHandleProps} />
    </styled.Container>
  );
};

export default TileMenu;
