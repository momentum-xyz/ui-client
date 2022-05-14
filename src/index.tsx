import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';
import {BrowserRouter} from 'react-router-dom';
import {Integrations} from '@sentry/tracing';
import * as Sentry from '@sentry/react';

import {StoreProvider} from 'shared/hooks';
import 'shared/services/i18n';

import {App} from './scenes';
import {RootStore} from './stores';

// FIXME: Must be deleted
import './styles/App.scss';
import './styles/tailwind.css';
import './static/styles/main.css';

// FIXME: Move to package.json
export const version = 'v0.14.2';
console.info(`*** FE version ${version} ***`);

declare global {
  interface Window {
    _env_: any;
  }
}

// FIXME: Must be refactored
const subStr: string[] = window._env_.DEPLOYMENT_BASE_URL.match(/(?:http:\/\/)?(?:([^.]+))?/);
const subStr2: string = subStr[1].replace('https://', '');
const environment: string = subStr2.replace('/', '');

if (window._env_.SENTRY_DSN) {
  Sentry.init({
    dsn: window._env_.SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    environment: environment,
    release: version,
    tracesSampleRate: 1.0
  });
}

/**
 * init rootStore and pass dependencies
 * https://mobx-state-tree.js.org/concepts/dependency-injection
 */
const history = createBrowserHistory({});
const rootStore = RootStore.create({}, {history});

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('reactContainer')
);
