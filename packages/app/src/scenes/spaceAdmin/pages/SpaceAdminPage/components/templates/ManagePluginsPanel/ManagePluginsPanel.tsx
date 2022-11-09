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
  const {spaceAdminStore, mainStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {space, addPluginDialog} = spaceManagerStore;
  const {pluginsStore} = mainStore;

  if (!space) {
    return null;
  }

  return (
    <SectionPanel title={t('titles.plugins')} onAdd={addPluginDialog.open}>
      <styled.Body>
        {addPluginDialog.isOpen && (
          <AddPluginDialog onClose={addPluginDialog.close} spaceId={space.id} />
        )}
        <styled.List className="noScrollIndicator">
          {pluginsStore.spacePlugins.map((plugin) => (
            <AdminListItem
              key={plugin.subPath}
              name={plugin.name}
              userId={plugin.id}
              type={`/${plugin.subPath}`}
              onRemove={(id, _) => pluginsStore.removePluginFromSpace(space.id, id)}
            />
          ))}
        </styled.List>
      </styled.Body>
    </SectionPanel>
  );
};

export default observer(ManagePluginsPanel);
