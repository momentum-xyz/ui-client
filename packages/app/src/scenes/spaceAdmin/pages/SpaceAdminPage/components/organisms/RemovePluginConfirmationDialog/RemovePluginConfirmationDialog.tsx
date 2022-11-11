import React, {FC} from 'react';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {Dialog, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';

import * as styled from './RemovePluginConfirmationDialog.styled';

interface PropsInterface {
  spaceId: string;
  pluginId: string;
  pluginName: string;
  isPluginRemovalPending: boolean;
  onConfirm: (spaceId: string, pluginId: string, pluginName: string) => void;
  onCancel: () => void;
}

const RemovePluginConfirmationDialog: FC<PropsInterface> = ({
  spaceId,
  pluginId,
  pluginName,
  isPluginRemovalPending,
  onConfirm,
  onCancel
}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <Dialog
      title={t('titles.deletePluginFromSpace')}
      hasBorder
      theme={theme}
      approveInfo={{
        title: t('actions.remove'),
        onClick: () => onConfirm(spaceId, pluginId, pluginName),
        variant: 'danger',
        icon: 'bin',
        disabled: isPluginRemovalPending
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: onCancel,
        variant: 'primary',
        disabled: isPluginRemovalPending
      }}
    >
      <styled.Body>
        <Text text={t('messages.deletePluginConfirmation', {pluginName: pluginName})} size="s" />
      </styled.Body>
    </Dialog>
  );
};

export default observer(RemovePluginConfirmationDialog);
