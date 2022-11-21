import {MiroPluginInterface} from 'core/interfaces';

import {usePlugin} from './shared/hooks';

import '@momentum-xyz/ui-kit/dist/themes/themes';

import 'shared/services/i18n';
import 'core/utils/boardsPicker.1.0.js';

const Plugin: MiroPluginInterface = {
  usePlugin
};

export default Plugin;
