import '@momentum-xyz/ui-kit/dist/themes/themes';

import {AppConfigInterface} from 'core/interfaces';
import {usePlugin} from 'shared/hooks';
import 'shared/services/i18n';
import {PluginInterface} from '@momentum-xyz/sdk';

const Plugin: PluginInterface<AppConfigInterface> = {
  usePlugin
};

export default Plugin;
