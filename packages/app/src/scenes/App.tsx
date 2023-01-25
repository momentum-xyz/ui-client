import React, {FC, Suspense, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory, useLocation} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {isBrowserSupported} from '@momentum-xyz/core';
import {LoaderFallback} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useApiHandlers, useStore} from 'shared/hooks';
import {httpErrorCodes} from 'api/constants';
import {SystemWideError} from 'ui-kit';
import {createSwitchByConfig, isTargetRoute} from 'core/utils';
import {UnityPage} from 'scenes/unity';

import {PRIVATE_ROUTES, PRIVATE_ROUTES_WITH_UNITY, SYSTEM_ROUTES} from './App.routes';
import AppAuth from './AppAuth';
import AppLayers from './AppLayers';
import {GlobalStyles} from './App.styled';
import {TestnetMarkWidget} from './widgets/pages';

import 'react-notifications/lib/notifications.css';
import 'react-toastify/dist/ReactToastify.css';

const App: FC = () => {
  const rootStore = useStore();
  const {configStore, sessionStore, themeStore, unityStore, sentryStore} = rootStore;
  const {configLoadingErrorCode} = configStore;
  const {unityInstanceStore} = unityStore;

  const {pathname} = useLocation<{pathname: string}>();
  const history = useHistory();
  const {t} = useTranslation();

  useApiHandlers();

  useEffect(() => {
    rootStore.initApplication();
  }, [rootStore]);

  useEffect(() => {
    if (configStore.isConfigReady) {
      sessionStore.init();
      sentryStore.init();
      unityInstanceStore.init();
    }
  }, [sessionStore, configStore.isConfigReady, unityInstanceStore, sentryStore]);

  const isBrowserUnsupported = !isBrowserSupported();

  useEffect(() => {
    if (isBrowserUnsupported) {
      history.push({pathname: ROUTES.system.wrongBrowser});
    }
  }, [isBrowserUnsupported, history]);

  if (configStore.isError && !configStore.isConfigReady) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <SystemWideError
          text={
            configLoadingErrorCode === httpErrorCodes.MAINTENANCE
              ? t('systemMessages.underMaintenance')
              : t('errors.somethingWentWrongTryAgain')
          }
          showRefreshButton
          theme={themeStore.theme}
        />
      </ThemeProvider>
    );
  }

  if (configStore.isConfigReady && !configStore.isBlockchainUrlReady) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <SystemWideError
          text={
            configLoadingErrorCode === httpErrorCodes.MAINTENANCE
              ? t('systemMessages.underMaintenance')
              : t('systemMessages.noBlockchainUrlAvailable')
          }
          showRefreshButton
          theme={themeStore.theme}
        />
      </ThemeProvider>
    );
  }

  // SYSTEM ROUTES
  if (isTargetRoute(pathname, SYSTEM_ROUTES)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <Suspense fallback={<LoaderFallback text={t('messages.loading')} />}>
          {createSwitchByConfig(SYSTEM_ROUTES)}
        </Suspense>
        <TestnetMarkWidget withOffset />
      </ThemeProvider>
    );
  }

  if (!configStore.isConfigReady || sessionStore.isAuthenticating) {
    return <></>;
  }

  // PRIVATE ROUTES WITH UNITY
  if (isTargetRoute(pathname, PRIVATE_ROUTES_WITH_UNITY)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <AppAuth>
          <GlobalStyles />
          <UnityPage />
          <Suspense fallback={<LoaderFallback text={t('messages.loading')} />}>
            <AppLayers renderUnity>{createSwitchByConfig(PRIVATE_ROUTES_WITH_UNITY)}</AppLayers>
          </Suspense>
          <TestnetMarkWidget withOffset />
        </AppAuth>
      </ThemeProvider>
    );
  }

  // PRIVATE ROUTES
  return (
    <ThemeProvider theme={themeStore.theme}>
      <Suspense fallback={<LoaderFallback text={t('messages.loading')} />}>
        <AppAuth>
          <GlobalStyles />
          <AppLayers>{createSwitchByConfig(PRIVATE_ROUTES, ROUTES.explore)}</AppLayers>
          <TestnetMarkWidget />
        </AppAuth>
      </Suspense>
    </ThemeProvider>
  );
};

export default observer(App);
