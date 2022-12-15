import {FC, useCallback, useEffect} from 'react';
import {Portal, Tooltip} from '@momentum-xyz/ui-kit';
import {generatePath, useHistory} from 'react-router-dom';
import cn from 'classnames';

import {ROUTES} from 'core/constants';
import {GizmoTypeEnum} from 'core/enums';

import * as styled from './ObjectMenu.styled';

interface PropsInterface {
  objectId: string;
  worldId: string;
  position: {x: number; y: number};
  gizmoType: GizmoTypeEnum;
  onObjectRemove: () => void;
  onGizmoTypeChange: (type: GizmoTypeEnum) => void;
  fetchObject: (objectId: string) => void;
  onUndo: () => void;
  onRedo: () => void;
}

const ObjectMenu: FC<PropsInterface> = ({
  position,
  objectId,
  worldId,
  gizmoType,
  onObjectRemove,
  onGizmoTypeChange,
  fetchObject,
  onUndo,
  onRedo
}) => {
  const history = useHistory();

  useEffect(() => {
    fetchObject(objectId);
  }, [objectId, fetchObject]);

  const handleOnFunctionalityClick = useCallback(() => {
    console.info(worldId);
    history.push({
      pathname: generatePath(ROUTES.odyssey.builder.editor, {
        worldId,
        objectId
      })
    });
  }, [history, objectId, worldId]);

  return (
    <Portal>
      <styled.Container style={{left: position.x - 295, top: position.y - 100}}>
        <styled.MenuItem onClick={() => onGizmoTypeChange(GizmoTypeEnum.POSITION)}>
          <styled.MenuText
            text="Move"
            size="m"
            className={cn(gizmoType === GizmoTypeEnum.POSITION && 'selected')}
          />
        </styled.MenuItem>
        <styled.MenuItem onClick={() => onGizmoTypeChange(GizmoTypeEnum.ROTATION)}>
          <styled.MenuText
            text="Rotate"
            size="m"
            className={cn(gizmoType === GizmoTypeEnum.ROTATION && 'selected')}
          />
        </styled.MenuItem>
        <styled.MenuItem onClick={() => onGizmoTypeChange(GizmoTypeEnum.SCALE)}>
          <styled.MenuText
            text="Scale"
            size="m"
            className={cn(gizmoType === GizmoTypeEnum.SCALE && 'selected')}
          />
        </styled.MenuItem>
        <styled.MenuItem onClick={onUndo}>
          <styled.MenuText text="Undo" size="m" />
        </styled.MenuItem>
        <styled.MenuItem onClick={onRedo}>
          <styled.MenuText text="Redo" size="m" />
        </styled.MenuItem>
        <styled.MenuItem onClick={onObjectRemove}>
          <styled.MenuText text="Delete" size="m" />
        </styled.MenuItem>
        <Tooltip label="comming soon!" placement="bottom">
          <styled.MenuItem disabled>
            <styled.MenuText text="Copy" size="m" />
          </styled.MenuItem>
        </Tooltip>
        <styled.MenuItem onClick={handleOnFunctionalityClick}>
          <styled.MenuText text="Functionality" size="m" />
        </styled.MenuItem>
        <Tooltip label="comming soon!">
          <styled.MenuItem disabled>
            <styled.MenuText text="Add token gate" size="m" />
          </styled.MenuItem>
        </Tooltip>
      </styled.Container>
    </Portal>
  );
};

export default ObjectMenu;
