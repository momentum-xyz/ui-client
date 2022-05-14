import React from 'react';
import {DraggableProvided} from 'react-beautiful-dnd';

import {ReactComponent as RemoveIcon} from '../../../images/icons/trash.svg';
import {ReactComponent as MoveIcon} from '../../../images/icons/direction-button-arrows.svg';
import {ReactComponent as PencilIcon} from '../../../images/icons/pencil-2.svg';

export interface EditPanelMenuProps {
  id: string;
  permanentType: any;
  editTile?: (id: string) => void;
  deleteTile?: (id: string) => void;
  provided?: DraggableProvided;
}

const EditPanelMenu: React.FC<EditPanelMenuProps> = ({
  id,
  permanentType,
  editTile,
  deleteTile,
  provided
}) => {
  const canDelete = () => {
    return permanentType === null;
  };

  return (
    <div className="absolute bottom-1 right-1 pt-[4px] px-1 rounded-lg bg-black-20 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <button
        className="w-1.6 mr-1"
        style={{mixBlendMode: 'difference'}}
        {...provided?.dragHandleProps}
      >
        <MoveIcon />
      </button>
      <button
        className="w-1.6 mr-1"
        style={{mixBlendMode: 'difference'}}
        onClick={() => editTile?.(id)}
      >
        <PencilIcon />
      </button>
      {canDelete() && (
        <button
          className="w-1.6"
          style={{mixBlendMode: 'difference'}}
          onClick={() => deleteTile?.(id)}
        >
          <RemoveIcon />
        </button>
      )}
    </div>
  );
};

export default EditPanelMenu;
