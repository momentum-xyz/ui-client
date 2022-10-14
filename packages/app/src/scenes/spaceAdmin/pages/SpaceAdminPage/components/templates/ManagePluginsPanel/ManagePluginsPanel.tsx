import React, {FC} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {SectionPanel} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {
  AddPluginDialog,
  AdminListItem
} from 'scenes/spaceAdmin/pages/SpaceAdminPage/components/organisms';

import * as styled from './ManagePluginsPanel.styled';

const ManagePluginsPanel: FC = () => {
  const {spaceAdminStore, collaborationStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {space, addPluginDialog} = spaceManagerStore;
  const {pluginsStore} = collaborationStore;

  if (!space) {
    return null;
  }

  return (
    <SectionPanel title={t('titles.plugins')} onAdd={addPluginDialog.open}>
      <styled.Body>
        {addPluginDialog.isOpen && (
          <AddPluginDialog
            onClose={addPluginDialog.close}
            onConfirmation={(plugin) => {
              pluginsStore.addPlugin(plugin);
              addPluginDialog.close();
            }}
          />
        )}
        <styled.List className="noScrollIndicator">
          {pluginsStore.pluginLoaders.map((loader) => (
            <AdminListItem
              key={loader.name}
              name={loader.name}
              userId={loader.name}
              type={loader.subtitle}
              onRemove={pluginsStore.removePlugin}
            />
          ))}
        </styled.List>
      </styled.Body>
    </SectionPanel>
  );
};

export default observer(ManagePluginsPanel);
