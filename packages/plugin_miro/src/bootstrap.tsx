import {createRoot} from 'react-dom/client';
import {HostEmulator, PluginInterface} from '@momentum-xyz/sdk';

import plugin from './Plugin';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<HostEmulator plugin={plugin as PluginInterface} />);
