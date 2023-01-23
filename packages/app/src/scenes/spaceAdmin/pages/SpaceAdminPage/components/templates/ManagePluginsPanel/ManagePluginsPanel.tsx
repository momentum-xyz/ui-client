import React, {FC, useCallback, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {SectionPanel} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {
  AddPluginDialog,
  AdminListItem,
  RemovePluginConfirmationDialog
} from 'scenes/spaceAdmin/pages/SpaceAdminPage/components';
import {ToastContent} from 'ui-kit';

import * as styled from './ManagePluginsPanel.styled';

const ManagePluginsPanel: FC = () => {
  const {t} = useTranslation();
  const {spaceAdminStore} = useStore();
  const {spaceManagerStore, managePluginsStore} = spaceAdminStore;
  const {space, addPluginDialog, deletePluginConfirmationDialog} = spaceManagerStore;

  const [pluginIdToRemove, setPluginIdToRemove] = useState<string>();

  const pluginToRemove = useMemo(() => {
    return managePluginsStore.spacePlugins.find((plugin) => plugin.id === pluginIdToRemove);
  }, [managePluginsStore.spacePlugins, pluginIdToRemove]);

  const handleRemovePlugin = useCallback(
    async (spaceId: string, pluginId: string, pluginName: string) => {
      const isSuccess = await managePluginsStore.removePluginFromSpace(spaceId, pluginId);

      if (isSuccess) {
        await managePluginsStore.removePluginFromSpace(spaceId, pluginId);

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
    [deletePluginConfirmationDialog, managePluginsStore]
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
            isPluginRemovalPending={managePluginsStore.isRemovePluginPeding}
            onConfirm={handleRemovePlugin}
            onCancel={() => {
              deletePluginConfirmationDialog.close();
              setPluginIdToRemove(undefined);
            }}
          />
        )}
        <styled.List className="noScrollIndicator">
          {managePluginsStore.spacePlugins.map((plugin) => (
            <AdminListItem
              key={plugin.id}
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
