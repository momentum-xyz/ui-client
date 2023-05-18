import {Panel} from '@momentum-xyz/ui-kit';
import {FC} from 'react';

import {PluginConfigRenderer} from '../../../components';
import {PluginInterface} from '../../../interfaces';

interface PropsInterface {
  plugin: PluginInterface;
  config: unknown;
  onSave: (data: unknown) => void;
  onClose: () => void;
}

export const ConfigEmulator: FC<PropsInterface> = ({plugin, config, onSave, onClose}) => {
  const {configuration} = plugin;

  let content = (
    <Panel variant="primary" size="normal" onClose={onClose} title="">
      Plugin has no configuration
    </Panel>
  );

  if (configuration) {
    if (typeof configuration === 'function') {
      content = configuration({data: config, onSave, onCancel: onClose});
    } else {
      content = (
        <div>
          <PluginConfigRenderer
            config={configuration}
            defaultValue={config}
            onCancel={onClose}
            onSave={onSave}
          />
        </div>
      );
    }
  }

  return <div>{content}</div>;
};
