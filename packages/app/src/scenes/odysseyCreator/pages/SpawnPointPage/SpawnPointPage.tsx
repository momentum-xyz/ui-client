import React, {FC, useCallback, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {generatePath, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Button, Dialog, Text, useClickOutside} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {UnityPositionInterface} from 'core/interfaces';
import {TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';

import * as styled from './SpawnPointPage.styled';

const COLOR_PICKER_WIDTH_PX = 300;

const SpawnPointPage: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {spawnPointStore} = odysseyCreatorStore;
  const {worldId, unityInstanceStore} = unityStore;
  const {setSpawnPoint} = spawnPointStore;

  const ref = useRef<HTMLDivElement>(null);

  const history = useHistory();
  const {t} = useTranslation();

  useClickOutside(ref, () => {
    history.push(generatePath(ROUTES.odyssey.creator.base, {worldId}));
  });

  const onSetHandler = useCallback(async () => {
    const position: UnityPositionInterface | null = unityInstanceStore.getUserPosition();
    const rotation: UnityPositionInterface | null = unityInstanceStore.getUserRotation();

    if (position && rotation && (await setSpawnPoint(worldId, position, rotation))) {
      history.push(generatePath(ROUTES.odyssey.creator.base, {worldId}));
      toast.info(
        <ToastContent
          headerIconName="locator"
          title={t('labels.spawnPoint')}
          text={t('messages.spawnPointUpdated')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="locator"
          title={t('labels.spawnPoint')}
          text={t('messages.spawnPointNotUpdated')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, [unityInstanceStore, setSpawnPoint, worldId, history, t]);

  const onCancelHandler = useCallback(() => {
    history.push(generatePath(ROUTES.odyssey.creator.base, {worldId}));
  }, [history, worldId]);

  return (
    <Dialog
      icon="locator"
      iconSize="medium"
      position="center"
      title={t('titles.setSpawnPoint')}
      layoutSize={{width: `${COLOR_PICKER_WIDTH_PX}px`}}
      showBackground={false}
      headerStyle="normal"
      headerType="h3"
      showCloseButton
      noPadding
      shortTopPadding
      onClose={onCancelHandler}
    >
      <styled.Container ref={ref} data-testid="SpawnPointPage-test">
        <Text size="xs" text={t('textMessage.setSpawnPoint')} align="left" />

        <styled.ButtonContainer>
          <Button label={t('titles.setSpawnPoint')} onClick={onSetHandler} />
        </styled.ButtonContainer>
      </styled.Container>
    </Dialog>
  );
};

export default observer(SpawnPointPage);
