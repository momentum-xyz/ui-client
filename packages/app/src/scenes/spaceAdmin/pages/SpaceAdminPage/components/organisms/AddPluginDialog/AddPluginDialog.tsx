import React, {FC, useEffect, useMemo, useState} from 'react';
import {t} from 'i18next';
import {Dialog, Input} from '@momentum-xyz/ui-kit';

import {PluginInterface} from 'core/interfaces';

import * as styled from './AddPluginDialog.styled';

interface PropsInterface {
  onConfirmation: (plugin: PluginInterface) => void;
  onClose: () => void;
}

const AddPluginDialog: FC<PropsInterface> = ({onConfirmation, onClose}) => {
  const mockPlugin: PluginInterface = useMemo(
    () => ({
      name: 'momentum_plugin_template',
      subPath: 'template',
      subtitle: 'Template',
      iconName: 'gear',
      // TODO: Later change to remote url
      url: 'http://localhost:3002/remoteEntry.js',
      exact: true
    }),
    []
  );

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [subPath, setSubPath] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const plugin = useMemo(
    () => ({
      name: name,
      subPath: subPath,
      subtitle: subtitle,
      iconName: mockPlugin.iconName,
      // TODO: Later change to remote url
      url: url,
      exact: mockPlugin.exact
    }),
    [mockPlugin.exact, mockPlugin.iconName, name, subPath, subtitle, url]
  );

  useEffect(() => {
    if (name === 'momentum') {
      setName(mockPlugin.name);
      setUrl(mockPlugin.url);
      setSubPath(mockPlugin.subPath);
      setSubtitle(mockPlugin.subtitle ?? '');
    }
  }, [mockPlugin.name, mockPlugin.subPath, mockPlugin.subtitle, mockPlugin.url, name]);

  return (
    <Dialog
      title="Add plugin"
      approveInfo={{
        title: t('actions.add'),
        onClick: () => onConfirmation(plugin)
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: onClose
      }}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container>
        <Input label="Name" value={name} onChange={setName} />
        <Input label="Script URL" value={url} onChange={setUrl} />
        <Input label="Sub Path" value={subPath} onChange={setSubPath} />
        <Input label="Subtitle" value={subtitle} onChange={setSubtitle} />
      </styled.Container>
    </Dialog>
  );
};

export default AddPluginDialog;
