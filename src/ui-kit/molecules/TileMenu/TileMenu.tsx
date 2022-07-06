import React, {FC} from 'react';
import {DraggableProvided} from 'react-beautiful-dnd';

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
      <styled.SvgItem iconName="trash" size="normal" onClick={onDelete} isWhite />
      {isDelete && <styled.SvgItem iconName="pencil" size="normal" onClick={onEdit} isWhite />}
      <styled.SvgItem
        iconName="direction-arrows"
        size="normal"
        isWhite
        {...provided?.dragHandleProps}
      />
    </styled.Container>
  );
};

export default TileMenu;
