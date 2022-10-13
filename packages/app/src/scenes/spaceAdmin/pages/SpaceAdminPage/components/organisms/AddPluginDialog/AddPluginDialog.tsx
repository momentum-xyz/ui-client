import React, {FC} from 'react';
import {t} from 'i18next';
import {Dialog, Input} from '@momentum-xyz/ui-kit';

import {PluginInterface} from 'core/interfaces';

import * as styled from './AddPluginDialog.styled';

interface PropsInterface {
  onConfirmation: (plugin: PluginInterface) => void;
  onClose: () => void;
}

const AddPluginDialog: FC<PropsInterface> = ({onConfirmation, onClose}) => {
  const mockPlugin: PluginInterface = {
    name: 'momentum_plugin_template',
    subPath: 'template',
    subtitle: 'Template',
    iconName: 'gear',
    // TODO: Later change to remote url
    url: 'http://localhost:3002/remoteEntry.js',
    exact: true
  };

  return (
    <Dialog
      title="Add plugin"
      approveInfo={{
        title: t('actions.add'),
        onClick: () => onConfirmation(mockPlugin)
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: onClose
      }}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container>
        <Input label="Name" value={mockPlugin.name} />
        <Input label="Script URL" value={mockPlugin.url} />
        <Input label="Sub Path" value={mockPlugin.subPath} />
        <Input label="Subtitle" value={mockPlugin.subtitle} />
      </styled.Container>
    </Dialog>
  );
};

export default AddPluginDialog;
