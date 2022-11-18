import {PluginInterface} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';

import usePlugin from './shared/hooks/usePlugin';

const Plugin: PluginInterface<AppConfigInterface> = {
  usePlugin
};

export default Plugin;
