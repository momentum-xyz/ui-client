import React, {FC, useEffect, useMemo, useState} from 'react';
import {t} from 'i18next';
import {Dialog, IconNameType, Input, SvgButton} from '@momentum-xyz/ui-kit';

import {PluginInterface} from 'core/interfaces';

import * as styled from './AddPluginDialog.styled';

interface PropsInterface {
  onConfirmation: (plugin: PluginInterface) => void;
  onClose: () => void;
}

const AddPluginDialog: FC<PropsInterface> = ({onConfirmation, onClose}) => {
  const mockPlugin: PluginInterface = useMemo(
    () => ({
      id: 'ceb9ebad-283c-4b65-9c7e-1b87391e9f49',
      scopeName: 'momentum_plugin_template',
      subPath: 'template',
      subtitle: 'Template',
      iconName: 'gear',
      // TODO: Later change to remote url
      scriptUrl: 'http://localhost:3002/remoteEntry.js',
      exact: true
    }),
    []
  );

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [subPath, setSubPath] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconNameType>('gear');

  const plugin = useMemo(
    () => ({
      id: mockPlugin.id,
      scopeName: name,
      subPath: subPath,
      subtitle: subtitle,
      iconName: selectedIcon,
      // TODO: Later change to remote url
      scriptUrl: url,
      exact: mockPlugin.exact
    }),
    [mockPlugin.exact, mockPlugin.id, name, selectedIcon, subPath, subtitle, url]
  );

  useEffect(() => {
    if (name === 'momentum') {
      setName(mockPlugin.scopeName);
      setUrl(mockPlugin.scriptUrl);
      setSubPath(mockPlugin.subPath);
      setSubtitle(mockPlugin.subtitle ?? '');
    }
  }, [mockPlugin.scopeName, mockPlugin.scriptUrl, mockPlugin.subPath, mockPlugin.subtitle, name]);

  const iconsToSelect = useMemo<IconNameType[]>(
    () => [
      'gear',
      'warning',
      'approved',
      'stage',
      'stats',
      'trash',
      'wallet',
      'astro',
      'vibe',
      'tiles'
    ],
    []
  );

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
        <styled.IconHeading type="h3" label="Select Icon:" align="left" />
        <styled.IconSelector>
          {iconsToSelect.map((icon) => (
            <styled.IconItem key={icon} className={selectedIcon === icon ? 'selected' : undefined}>
              <SvgButton iconName={icon} onClick={() => setSelectedIcon(icon)} size="medium" />
            </styled.IconItem>
          ))}
        </styled.IconSelector>
      </styled.Container>
    </Dialog>
  );
};

export default AddPluginDialog;
