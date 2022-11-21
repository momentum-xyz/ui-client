import {PluginInterface} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';

import usePlugin from './shared/hooks/usePlugin';

import '@momentum-xyz/ui-kit/dist/themes/themes';

import 'shared/services/i18n';
import 'core/utils/boardsPicker.1.0.js';

const Plugin: PluginInterface<AppConfigInterface> = {
  usePlugin
};

export default Plugin;
