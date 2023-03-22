import '@momentum-xyz/ui-kit/dist/themes/themes';

import {AppConfigInterface} from 'core/interfaces';
import {usePlugin} from 'shared/hooks';
import {PluginInterface} from '@momentum-xyz/sdk';
import {configDescription} from 'api/constants';

const Plugin: PluginInterface<AppConfigInterface> = {
  usePlugin,

  configuration: configDescription
};

export default Plugin;
