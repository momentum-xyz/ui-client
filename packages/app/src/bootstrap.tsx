import {createRoot} from 'react-dom/client';
import {createBrowserHistory} from 'history';
import {BrowserRouter} from 'react-router-dom';
import {Web3ReactProvider} from '@web3-react/core';

import {web3GetLibrary} from 'api/repositories';
import {appVariables} from 'api/constants';
import {StoreProvider} from 'shared/hooks';

import {App} from './scenes';
import {RootStore} from './stores';

import './static/styles/main.scss';

/**
 * init rootStore and pass dependencies
 * https://mobx-state-tree.js.org/concepts/dependency-injection
 */
const history = createBrowserHistory({});
const rootStore = RootStore.create({}, {history});

console.info(`*** FE ${appVariables.APP_VERSION} ***`);

const container = document.getElementById('reactContainer');
const root = createRoot(container!);

root.render(
  <StoreProvider value={rootStore}>
    <Web3ReactProvider getLibrary={web3GetLibrary}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Web3ReactProvider>
  </StoreProvider>
);
