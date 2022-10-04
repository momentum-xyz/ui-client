import React, {FC} from 'react';
import {DraggableProvided} from 'react-beautiful-dnd';
import {PropsWithThemeInterface, SvgButton} from '@momentum/ui-kit';

import * as styled from './TileMenu.styled';

interface PropsInterface extends PropsWithThemeInterface {
  onEdit: () => void;
  onDelete: () => void;
  provided?: DraggableProvided;
  isDelete: boolean;
  className?: string;
}

const TileMenu: FC<PropsInterface> = ({onEdit, onDelete, provided, isDelete, className}) => {
  return (
    <styled.Container className={className} data-testid="TileMenu-test">
      <styled.InnerContainer>
        {isDelete && <SvgButton iconName="trash" size="normal" onClick={onDelete} isWhite />}
        <SvgButton iconName="pencil" size="normal" onClick={onEdit} isWhite />
        <SvgButton
          iconName="direction-arrows"
          size="normal"
          isWhite
          {...provided?.dragHandleProps}
        />
      </styled.InnerContainer>
    </styled.Container>
  );
};

export default TileMenu;
