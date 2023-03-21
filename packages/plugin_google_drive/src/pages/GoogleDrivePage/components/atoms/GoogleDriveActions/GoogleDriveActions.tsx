import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, PropsWithThemeInterface} from '@momentum-xyz/ui-kit';
import {GoogleDocumentInterface} from 'core/interfaces';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './GoogleDriveActions.styled';

interface PropsInterface extends PropsWithThemeInterface {
  objectId?: string;
  isAdmin: boolean;
  googleDocument: GoogleDocumentInterface | null;
  pickDocument: () => void;
  closeDocument: () => void;
}

const GoogleDriveActions: FC<PropsInterface> = ({
  theme,
  objectId,
  isAdmin,
  googleDocument,
  closeDocument,
  pickDocument
}) => {
  const {t} = useI18n();

  if (!isAdmin || !googleDocument?.url || !objectId) {
    return null;
  }

  return (
    <styled.Container theme={theme}>
      <Button
        label={t('plugin_gd.actions.changeDocument')}
        variant="primary"
        onClick={pickDocument}
      />
      <Button label={t('plugin_gd.actions.close')} variant="danger" onClick={closeDocument} />
    </styled.Container>
  );
};

export default observer(GoogleDriveActions);
