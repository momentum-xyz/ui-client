import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {AxiosInstance} from 'axios';
import {Button, PropsWithThemeInterface} from '@momentum/ui-kit';

import {MiroBoardStoreType} from 'stores/MiroBoardStore';

import * as styled from './MiroActions.styled';

interface PropsInterface extends PropsWithThemeInterface {
  spaceId?: string;
  request: AxiosInstance;
  isAdmin: boolean;
  miroBoardStore: MiroBoardStoreType;
}

const MiroActions: FC<PropsInterface> = ({theme, spaceId, request, isAdmin, miroBoardStore}) => {
  const {t} = useTranslation();

  const closeBoard = useCallback(async () => {
    await miroBoardStore.disableMiroBoard(spaceId || '', request);
    await miroBoardStore.fetchMiroBoard(spaceId || '', request);
  }, [miroBoardStore, spaceId, request]);

  if (!spaceId || !isAdmin || !miroBoardStore.miroBoard?.data?.accessLink) {
    return null;
  }

  return (
    <styled.Container theme={theme}>
      <Button
        label={t('actions.changeBoard')}
        onClick={() => miroBoardStore.pickBoard(spaceId, request)}
      />
      <Button label={t('actions.closeBoard')} variant="danger" onClick={closeBoard} />
    </styled.Container>
  );
};

export default observer(MiroActions);
