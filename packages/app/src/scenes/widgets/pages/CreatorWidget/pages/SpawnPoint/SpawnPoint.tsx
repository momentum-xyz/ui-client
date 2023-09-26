import {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {PositionInterface, useI18n} from '@momentum-xyz/core';
import {Button} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';

import * as styled from './SpawnPoint.styled';

const SpawnPoint: FC = () => {
  const {widgetStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {spawnPointStore} = creatorStore;
  const {worldId, world3dStore} = universeStore;
  const {setSpawnPoint} = spawnPointStore;

  const {t} = useI18n();

  const onSetHandler = useCallback(async () => {
    const position: PositionInterface | null = null;
    const rotation: PositionInterface | null = null;

    if (position && rotation && (await setSpawnPoint(worldId, position, rotation))) {
      toast.info(
        <ToastContent icon="locator" text={t('messages.spawnPointUpdated')} />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent icon="locator" text={t('messages.spawnPointNotUpdated')} />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, [world3dStore, setSpawnPoint, worldId, t]);

  return (
    <styled.Container data-testid="SpawnPoint-test">
      <div>{t('message.setSpawnPoint')}</div>

      <styled.ButtonContainer>
        <Button label={t('titles.setSpawnPoint')} onClick={onSetHandler} />
      </styled.ButtonContainer>
    </styled.Container>
  );
};

export default observer(SpawnPoint);
