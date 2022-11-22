import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Button, PropsWithThemeInterface} from '@momentum-xyz/ui-kit';
import {MiroBoardInterface} from 'core/interfaces';

import * as styled from './MiroActions.styled';

interface PropsInterface extends PropsWithThemeInterface {
  objectId?: string;
  isAdmin: boolean;
  board: MiroBoardInterface | null;
  pick: () => void;
  disable: () => void;
}

const MiroActions: FC<PropsInterface> = ({theme, objectId, isAdmin, board, disable, pick}) => {
  const {t} = useTranslation();

  if (!objectId || !isAdmin || !board?.accessLink) {
    return null;
  }

  return (
    <styled.Container theme={theme}>
      <Button label={t('actions.changeBoard')} onClick={pick} />
      <Button label={t('actions.closeBoard')} variant="danger" onClick={disable} />
    </styled.Container>
  );
};

export default observer(MiroActions);
