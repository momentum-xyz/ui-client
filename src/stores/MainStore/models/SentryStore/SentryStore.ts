import {types} from 'mobx-state-tree';
import {Integrations} from '@sentry/tracing';
import * as Sentry from '@sentry/react';

import {appVariables} from 'api/constants';

const SentryStore = types.model('SentryStore', {}).actions((self) => ({
  init(): void {
    if (appVariables.SENTRY_DSN) {
      Sentry.init({
        dsn: appVariables.SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
        environment: appVariables.BE_URL,
        release: appVariables.APP_VERSION,
        tracesSampleRate: 1.0
      });
    }
  }
}));

export {SentryStore};
