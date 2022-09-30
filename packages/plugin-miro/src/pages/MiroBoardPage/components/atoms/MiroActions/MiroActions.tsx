import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {AxiosInstance} from 'axios';
import {PropsWithThemeInterface} from '@momentum/ui-kit';

import {MiroBoardStoreInterface} from 'stores/MiroBoardStore';

import * as styled from './MiroActions.styled';

interface PropsInterface extends PropsWithThemeInterface {
  spaceId?: string;
  request?: AxiosInstance;
  isAdmin: boolean;
  miroBoardStore: MiroBoardStoreInterface;
}

const MiroActions: FC<PropsInterface> = ({theme, spaceId, request, isAdmin, miroBoardStore}) => {
  const {t} = useTranslation();

  if (!spaceId || !isAdmin || !miroBoardStore.miroBoard?.data?.accessLink) {
    return null;
  }

  return (
    <styled.Container theme={theme}>
      <styled.Action theme={theme} onClick={() => miroBoardStore.pickBoard(spaceId, request)}>
        {t('actions.changeBoard')}
      </styled.Action>
      <styled.Action
        theme={theme}
        onClick={() => miroBoardStore.disableMiroBoard(spaceId, request)}
      >
        {t('actions.closeBoard')}
      </styled.Action>
    </styled.Container>
  );
};

export default observer(MiroActions);
