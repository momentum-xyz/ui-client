import {PluginInterface} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';
import {configDescription} from 'api/constants';

import {usePlugin} from './shared/hooks';

// import '@momentum-xyz/ui-kit/dist/themes/themes';

import 'core/utils/boardsPicker.1.0.js';

const Plugin: PluginInterface<AppConfigInterface> = {
  usePlugin,

  configuration: configDescription
};

export default Plugin;
