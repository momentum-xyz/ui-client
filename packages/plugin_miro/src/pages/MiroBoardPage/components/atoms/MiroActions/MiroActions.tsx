import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit';
import {MiroBoardInterface} from 'core/interfaces';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './MiroActions.styled';

interface PropsInterface {
  objectId?: string;
  isAdmin: boolean;
  board: MiroBoardInterface | null;
  pick: () => void;
  disable: () => void;
}

const MiroActions: FC<PropsInterface> = ({objectId, isAdmin, board, disable, pick}) => {
  const {t} = useI18n();

  if (!objectId || !isAdmin || !board?.accessLink) {
    return null;
  }

  return (
    <styled.Container>
      <Button label={t('plugin_miro.actions.changeBoard')} onClick={pick} />
      <Button
        label={t('plugin_miro.actions.closeBoard')}
        // variant="danger"
        onClick={disable}
      />
    </styled.Container>
  );
};

export default observer(MiroActions);
