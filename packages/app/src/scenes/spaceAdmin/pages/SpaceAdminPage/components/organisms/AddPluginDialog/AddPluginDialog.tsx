import React, {FC, useCallback, useEffect, useState} from 'react';
import {Dialog, Dropdown, Input, useDebouncedCallback} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {PluginQueryResultType} from 'core/models';

import * as styled from './AddPluginDialog.styled';

interface PropsInterface {
  spaceId: string;
  onClose: () => void;
}

const AddPluginDialog: FC<PropsInterface> = ({spaceId, onClose}) => {
  const {spaceAdminStore} = useStore();
  const {managePluginsStore} = spaceAdminStore;
  const {searchedPlugins} = managePluginsStore;

  const {t} = useTranslation();

  const [selectedPlugin, setSelectedPlugin] = useState<PluginQueryResultType>();

  const search = useDebouncedCallback(managePluginsStore.searchPlugins, 500, []);

  useEffect(() => {
    return () => {
      managePluginsStore.searchQuery.resetModel();
      search();
    };
  }, [managePluginsStore, search]);

  const onInputChange = useCallback(
    (value: string) => {
      setSelectedPlugin(undefined);
      managePluginsStore.searchQuery.setQuery(value);
      search();
    },
    [managePluginsStore, search]
  );

  return (
    <Dialog
      title={t('titles.addPlugin')}
      approveInfo={{
        title: t('actions.add'),
        disabled: !selectedPlugin,
        onClick: async () => {
          if (!selectedPlugin) {
            return;
          }

          await managePluginsStore.addPluginToSpace(spaceId, selectedPlugin.plugin_uuid);
          onClose();
        }
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: onClose
      }}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container>
        <Input
          label={t('labels.search')}
          defaultValue={managePluginsStore.searchQuery.query}
          onChange={onInputChange}
          autoFocus
        />
        {managePluginsStore.searchedPlugins.length > 0 && (
          <Dropdown
            placeholder={t('placeholders.selectPlugin')}
            variant="secondary"
            value={selectedPlugin?.plugin_uuid ?? ''}
            options={searchedPlugins.map((plugin) => {
              return {
                label: plugin.plugin_name,
                value: plugin.plugin_uuid
              };
            })}
            onOptionSelect={(option) =>
              setSelectedPlugin({plugin_name: option.label, plugin_uuid: option.value})
            }
          />
        )}
      </styled.Container>
    </Dialog>
  );
};

export default observer(AddPluginDialog);
