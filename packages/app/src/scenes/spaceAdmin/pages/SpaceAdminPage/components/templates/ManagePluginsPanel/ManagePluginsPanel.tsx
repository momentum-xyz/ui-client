import React, {FC, useCallback, useMemo, useState} from 'react';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import {SectionPanel} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {
  AddPluginDialog,
  AdminListItem,
  RemovePluginConfirmationDialog
} from 'scenes/spaceAdmin/pages/SpaceAdminPage/components';
import {ToastContent} from 'ui-kit';

import * as styled from './ManagePluginsPanel.styled';

const ManagePluginsPanel: FC = () => {
  const {spaceAdminStore, mainStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {space, addPluginDialog, deletePluginConfirmationDialog} = spaceManagerStore;
  const {pluginsStore} = mainStore;

  const [pluginIdToRemove, setPluginIdToRemove] = useState<string>();

  const pluginToRemove = useMemo(() => {
    const plugin = pluginsStore.spacePlugins.find((plugin) => plugin.id === pluginIdToRemove);

    return plugin;
  }, [pluginsStore.spacePlugins, pluginIdToRemove]);

  const handleRemovePlugin = useCallback(
    async (spaceId: string, pluginId: string, pluginName: string) => {
      const isSuccess = await pluginsStore.removePluginFromSpace(spaceId, pluginId);

      if (isSuccess) {
        await pluginsStore.removePluginFromSpace(spaceId, pluginId);

        toast.info(
          <ToastContent
            showCloseButton
            headerIconName="alert"
            title={t('titles.success')}
            text={t('messages.pluginRemovedSuccessfully', {pluginName: pluginName})}
          />
        );
        setPluginIdToRemove(undefined);
        deletePluginConfirmationDialog.close();
      } else {
        toast.error(
          <ToastContent
            isDanger
            showCloseButton
            headerIconName="alert"
            title={t('titles.error')}
            text={t('messages.errorWhileRemovingPlugin', {pluginName: pluginName})}
          />
        );
      }
    },
    [deletePluginConfirmationDialog, pluginsStore]
  );

  if (!space) {
    return null;
  }

  return (
    <SectionPanel title={t('titles.plugins')} onAdd={addPluginDialog.open}>
      <styled.Body>
        {addPluginDialog.isOpen && (
          <AddPluginDialog onClose={addPluginDialog.close} spaceId={space.id} />
        )}
        {deletePluginConfirmationDialog.isOpen && pluginToRemove && (
          <RemovePluginConfirmationDialog
            spaceId={space.id}
            pluginId={pluginToRemove.id}
            pluginName={pluginToRemove.name}
            isPluginRemovalPending={pluginsStore.isRemovePluginPeding}
            onConfirm={handleRemovePlugin}
            onCancel={deletePluginConfirmationDialog.close}
          />
        )}
        <styled.List className="noScrollIndicator">
          {pluginsStore.spacePlugins.map((plugin) => (
            <AdminListItem
              key={plugin.subPath}
              name={plugin.name}
              userId={plugin.id}
              type={`/${plugin.subPath}`}
              onRemove={(id) => {
                setPluginIdToRemove(id);
                deletePluginConfirmationDialog.open();
              }}
            />
          ))}
        </styled.List>
      </styled.Body>
    </SectionPanel>
  );
};

export default observer(ManagePluginsPanel);
