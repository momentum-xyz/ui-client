import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {Dialog, Portal, Tooltip} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import cn from 'classnames';

import {ROUTES} from 'core/constants';
import {GizmoTypeEnum} from 'core/enums';
import {useStore} from 'shared/hooks';

import * as styled from './ObjectMenu.styled';

const OBJECT_MENU_OFFSET_X = 295;
const OBJECT_MENU_OFFSET_Y = 100;

const ObjectMenu: FC = () => {
  const {odysseyCreatorStore, universeStore} = useStore();
  const {objectFunctionalityStore, objectColorStore} = odysseyCreatorStore;
  const {worldId, instance3DStore} = universeStore;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isObjectColor, setIsObjectColor] = useState(false);

  const navigate = useNavigate();
  const {t} = useI18n();

  const topOffset = instance3DStore.objectMenuPosition.y - OBJECT_MENU_OFFSET_Y;
  const leftOffset = instance3DStore.objectMenuPosition.x - OBJECT_MENU_OFFSET_X;
  const objectId = instance3DStore.selectedObjectId ?? ' ';

  useEffect(() => {
    objectFunctionalityStore.init(objectId);
    objectColorStore.isColorPickerAvailable(worldId, objectId).then((isAvailable) => {
      setIsObjectColor(isAvailable);
    });
  }, [objectId, objectFunctionalityStore, objectColorStore, worldId]);

  const handleOnFunctionalityClick = useCallback(() => {
    navigate({
      pathname: generatePath(ROUTES.odyssey.creator.functionality, {
        worldId,
        objectId
      })
    });
  }, [navigate, objectId, worldId]);

  const handleOnColorClick = useCallback(() => {
    navigate({
      pathname: generatePath(ROUTES.odyssey.creator.objectColor, {
        worldId,
        objectId
      })
    });
  }, [navigate, objectId, worldId]);

  return (
    <Portal>
      <styled.Container data-testid="ObjectMenu-test" style={{left: leftOffset, top: topOffset}}>
        <styled.TitleBar>
          <styled.Title
            type="h3"
            transform="uppercase"
            label={objectFunctionalityStore.objectName || ''}
          />
        </styled.TitleBar>

        <styled.MenuItem onClick={() => instance3DStore.changeGizmoType(GizmoTypeEnum.POSITION)}>
          <styled.MenuText
            text={t('actions.move')}
            size="m"
            className={cn(instance3DStore.gizmoMode === GizmoTypeEnum.POSITION && 'selected')}
          />
        </styled.MenuItem>

        <styled.MenuItem onClick={() => instance3DStore.changeGizmoType(GizmoTypeEnum.ROTATION)}>
          <styled.MenuText
            text={t('actions.rotate')}
            size="m"
            className={cn(instance3DStore.gizmoMode === GizmoTypeEnum.ROTATION && 'selected')}
          />
        </styled.MenuItem>

        <styled.MenuItem onClick={() => instance3DStore.changeGizmoType(GizmoTypeEnum.SCALE)}>
          <styled.MenuText
            text={t('actions.scale')}
            size="m"
            className={cn(instance3DStore.gizmoMode === GizmoTypeEnum.SCALE && 'selected')}
          />
        </styled.MenuItem>

        <styled.MenuItem onClick={instance3DStore.undo}>
          <styled.MenuText text={t('actions.undo')} size="m" />
        </styled.MenuItem>

        <styled.MenuItem onClick={instance3DStore.redo}>
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

        <styled.MenuItem
          disabled={objectFunctionalityStore.isObjectPortal}
          onClick={handleOnFunctionalityClick}
        >
          <styled.MenuText text={t('actions.functionality')} size="m" />
        </styled.MenuItem>

        {isObjectColor && (
          <styled.MenuItem onClick={handleOnColorClick}>
            <styled.MenuText text={t('actions.colour')} size="m" />
          </styled.MenuItem>
        )}

        <Tooltip label={t('messages.comingSoonExclamation')}>
          <styled.MenuItem disabled>
            <styled.MenuText text={t('actions.addTokenGate')} size="m" />
          </styled.MenuItem>
        </Tooltip>

        {showDeleteDialog && (
          <Dialog
            title={
              objectFunctionalityStore.objectName
                ? t('messages.deleteNamedObject', {name: objectFunctionalityStore.objectName})
                : t('messages.delete')
            }
            approveInfo={{
              title: t('actions.delete'),
              onClick: () => {
                objectFunctionalityStore.deleteObject();
                instance3DStore.objectMenu.close();
              },
              variant: 'danger'
            }}
            declineInfo={{
              title: t('actions.cancel'),
              onClick: () => {
                setShowDeleteDialog(false);
              },
              variant: 'primary'
            }}
            onClose={() => {
              setShowDeleteDialog(false);
            }}
            showCloseButton
          />
        )}
      </styled.Container>
    </Portal>
  );
};

export default observer(ObjectMenu);
