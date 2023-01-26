import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';
import {Dialog, Portal, Tooltip} from '@momentum-xyz/ui-kit';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {GizmoTypeEnum} from 'core/enums';
import {useStore} from 'shared/hooks';

import * as styled from './ObjectMenu.styled';

const OBJECT_MENU_OFFSET_X = 295;
const OBJECT_MENU_OFFSET_Y = 100;

const ObjectMenu: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {objectFunctionalityStore} = odysseyCreatorStore;
  const {worldId, unityInstanceStore} = unityStore;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const history = useHistory();
  const {t} = useTranslation();

  const objectId = unityInstanceStore.selectedObjectId ?? ' ';

  useEffect(() => {
    objectFunctionalityStore.fetchObject(objectId);
  }, [objectId, objectFunctionalityStore]);

  const handleOnFunctionalityClick = useCallback(() => {
    history.push({
      pathname: generatePath(ROUTES.odyssey.creator.functionality, {
        worldId,
        objectId
      })
    });
  }, [history, objectId, worldId]);

  const handleOnColorClick = useCallback(() => {
    history.push({
      pathname: generatePath(ROUTES.odyssey.creator.objectColor, {
        worldId,
        objectId
      })
    });
  }, [history, objectId, worldId]);

  return (
    <Portal>
      <styled.Container
        data-testid="ObjectMenu-test"
        style={{
          left: unityInstanceStore.objectMenuPosition.x - OBJECT_MENU_OFFSET_X,
          top: unityInstanceStore.objectMenuPosition.y - OBJECT_MENU_OFFSET_Y
        }}
      >
        <styled.MenuItem onClick={() => unityInstanceStore.changeGizmoType(GizmoTypeEnum.POSITION)}>
          <styled.MenuText
            text={t('actions.move')}
            size="m"
            className={cn(unityInstanceStore.gizmoMode === GizmoTypeEnum.POSITION && 'selected')}
          />
        </styled.MenuItem>

        <styled.MenuItem onClick={() => unityInstanceStore.changeGizmoType(GizmoTypeEnum.ROTATION)}>
          <styled.MenuText
            text={t('actions.rotate')}
            size="m"
            className={cn(unityInstanceStore.gizmoMode === GizmoTypeEnum.ROTATION && 'selected')}
          />
        </styled.MenuItem>

        <styled.MenuItem onClick={() => unityInstanceStore.changeGizmoType(GizmoTypeEnum.SCALE)}>
          <styled.MenuText
            text={t('actions.scale')}
            size="m"
            className={cn(unityInstanceStore.gizmoMode === GizmoTypeEnum.SCALE && 'selected')}
          />
        </styled.MenuItem>

        <styled.MenuItem onClick={unityInstanceStore.undo}>
          <styled.MenuText text={t('actions.undo')} size="m" />
        </styled.MenuItem>

        <styled.MenuItem onClick={unityInstanceStore.redo}>
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

        <styled.MenuItem onClick={handleOnColorClick}>
          <styled.MenuText text={t('actions.colour')} size="m" />
        </styled.MenuItem>

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
                unityInstanceStore.objectMenu.close();
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
