import {FC, useCallback, useEffect, useState} from 'react';
import {Dialog, Portal, Tooltip} from '@momentum-xyz/ui-kit';
import {generatePath, useHistory} from 'react-router-dom';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {GizmoTypeEnum} from 'core/enums';

import * as styled from './ObjectMenu.styled';

const OBJECT_MENU_OFFSET_X = 295;
const OBJECT_MENU_OFFSET_Y = 100;

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

  const {t} = useTranslation();

  useEffect(() => {
    fetchObject(objectId);
  }, [objectId, fetchObject]);

  const handleOnFunctionalityClick = useCallback(() => {
    console.info(worldId);
    history.push({
      pathname: generatePath(ROUTES.odyssey.creator.functionality, {
        worldId,
        objectId
      })
    });
  }, [history, objectId, worldId]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Portal>
      <styled.Container
        style={{left: position.x - OBJECT_MENU_OFFSET_X, top: position.y - OBJECT_MENU_OFFSET_Y}}
      >
        <styled.MenuItem onClick={() => onGizmoTypeChange(GizmoTypeEnum.POSITION)}>
          <styled.MenuText
            text={t('actions.move')}
            size="m"
            className={cn(gizmoType === GizmoTypeEnum.POSITION && 'selected')}
          />
        </styled.MenuItem>
        <styled.MenuItem onClick={() => onGizmoTypeChange(GizmoTypeEnum.ROTATION)}>
          <styled.MenuText
            text={t('actions.rotate')}
            size="m"
            className={cn(gizmoType === GizmoTypeEnum.ROTATION && 'selected')}
          />
        </styled.MenuItem>
        <styled.MenuItem onClick={() => onGizmoTypeChange(GizmoTypeEnum.SCALE)}>
          <styled.MenuText
            text={t('actions.scale')}
            size="m"
            className={cn(gizmoType === GizmoTypeEnum.SCALE && 'selected')}
          />
        </styled.MenuItem>
        <styled.MenuItem onClick={onUndo}>
          <styled.MenuText text={t('actions.undo')} size="m" />
        </styled.MenuItem>
        <styled.MenuItem onClick={onRedo}>
          <styled.MenuText text={t('actions.redo')} size="m" />
        </styled.MenuItem>
        <styled.MenuItem onClick={() => setShowDeleteDialog(true)}>
          <styled.MenuText text={t('actions.delete')} size="m" />
        </styled.MenuItem>
        <Tooltip label={t('messages.comingSoonExclamation')} placement="bottom">
          <styled.MenuItem disabled>
            <styled.MenuText text={t('actions.copy')} size="m" />
          </styled.MenuItem>
        </Tooltip>
        <styled.MenuItem onClick={handleOnFunctionalityClick}>
          <styled.MenuText text={t('actions.functionality')} size="m" />
        </styled.MenuItem>
        <Tooltip label={t('messages.comingSoonExclamation')}>
          <styled.MenuItem disabled>
            <styled.MenuText text={t('actions.addTokenGate')} size="m" />
          </styled.MenuItem>
        </Tooltip>
        {showDeleteDialog && (
          <Dialog
            title={t('messages.delete')}
            approveInfo={{
              title: t('actions.delete'),
              onClick: onObjectRemove,
              variant: 'danger'
            }}
            declineInfo={{
              title: t('actions.cancel'),
              onClick: () => setShowDeleteDialog(false),
              variant: 'primary'
            }}
            onClose={() => setShowDeleteDialog(false)}
            showCloseButton
          />
        )}
      </styled.Container>
    </Portal>
  );
};

export default ObjectMenu;
