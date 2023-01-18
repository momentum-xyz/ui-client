import React from 'react';
import ReactDOM from 'react-dom';
import {HostEmulator, PluginInterface} from '@momentum-xyz/sdk';

import plugin from './Plugin';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <React.StrictMode>
    <HostEmulator plugin={plugin as PluginInterface} />
  </React.StrictMode>,
  root
);
