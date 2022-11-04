import React, {FC, useCallback, useEffect, useState} from 'react';
import {t} from 'i18next';
import {Dialog, Dropdown, Input, useDebouncedCallback} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {PluginQueryResultType} from 'stores/MainStore/models/PluginsStore';

import * as styled from './AddPluginDialog.styled';

interface PropsInterface {
  spaceId: string;
  onClose: () => void;
}

const AddPluginDialog: FC<PropsInterface> = ({spaceId, onClose}) => {
  const {mainStore} = useStore();
  const {pluginsStore} = mainStore;
  const {searchedPlugins} = pluginsStore;

  const [selectedPlugin, setSelectedPlugin] = useState<PluginQueryResultType>();

  const search = useDebouncedCallback(pluginsStore.searchPlugins, 500, []);

  useEffect(() => {
    return () => {
      pluginsStore.setQuery('');
      search();
    };
  }, [pluginsStore, search]);

  const onInputChange = useCallback(
    (value: string) => {
      setSelectedPlugin(undefined);
      pluginsStore.setQuery(value);
      search();
    },
    [pluginsStore, search]
  );

  return (
    <Dialog
      title="Add plugin"
      approveInfo={{
        title: t('actions.add'),
        disabled: !selectedPlugin,
        onClick: async () => {
          if (!selectedPlugin) {
            return;
          }

          await pluginsStore.addPluginToSpace(spaceId, selectedPlugin.plugin_uuid);
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
          label="Search"
          defaultValue={pluginsStore.searchQuery}
          onChange={onInputChange}
          autoFocus
        />
        {pluginsStore.searchedPlugins.length > 0 && (
          <Dropdown
            placeholder="Select Plugin"
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
