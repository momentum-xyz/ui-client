import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, PropsWithThemeInterface} from '@momentum-xyz/ui-kit';
import {MiroBoardInterface} from 'core/interfaces';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './MiroActions.styled';

interface PropsInterface extends PropsWithThemeInterface {
  objectId?: string;
  isAdmin: boolean;
  board: MiroBoardInterface | null;
  pick: () => void;
  disable: () => void;
}

const MiroActions: FC<PropsInterface> = ({theme, objectId, isAdmin, board, disable, pick}) => {
  const {t} = useI18n();

  if (!objectId || !isAdmin || !board?.accessLink) {
    return null;
  }

  return (
    <styled.Container theme={theme}>
      <Button label={t('plugin_miro.actions.changeBoard')} onClick={pick} />
      <Button label={t('plugin_miro.actions.closeBoard')} variant="danger" onClick={disable} />
    </styled.Container>
  );
};

export default observer(MiroActions);
