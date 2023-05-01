import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Button, Text} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {UnityPositionInterface} from 'core/interfaces';
import {TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';

import * as styled from './SpawnPointPage.styled';

const SpawnPointPage: FC = () => {
  const {creatorStore, universeStore} = useStore();
  const {spawnPointStore} = creatorStore;
  const {worldId, world3dStore} = universeStore;
  const {setSpawnPoint} = spawnPointStore;

  const {t} = useI18n();

  const onSetHandler = useCallback(async () => {
    const position: UnityPositionInterface | null = world3dStore?.getUserPosition() || null;
    const rotation: UnityPositionInterface | null = world3dStore?.getUserRotation() || null;

    if (position && rotation && (await setSpawnPoint(worldId, position, rotation))) {
      toast.info(
        <ToastContent
          icon="locator"
          title={t('labels.spawnPoint')}
          text={t('messages.spawnPointUpdated')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          icon="locator"
          title={t('labels.spawnPoint')}
          text={t('messages.spawnPointNotUpdated')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, [world3dStore, setSpawnPoint, worldId, t]);

  return (
    <styled.Container data-testid="SpawnPointPage-test">
      <Text size="xs" text={t('textMessage.setSpawnPoint')} align="left" />

      <styled.ButtonContainer>
        <Button label={t('titles.setSpawnPoint')} onClick={onSetHandler} />
      </styled.ButtonContainer>
    </styled.Container>
  );
};

export default observer(SpawnPointPage);
