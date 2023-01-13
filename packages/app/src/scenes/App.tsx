import React, {FC, Suspense, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Redirect, Switch, useHistory, useLocation} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {isBrowserSupported} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {useApiHandlers, useStore} from 'shared/hooks';
import {httpErrorCodes} from 'api/constants';
import {SystemWideError} from 'ui-kit';
import {createSwitchByConfig, isTargetRoute} from 'core/utils';
import {UnityPage} from 'scenes/unity';

import {
  PRIVATE_ROUTES,
  PRIVATE_ROUTES_WITH_UNITY,
  PUBLIC_ROUTES,
  SYSTEM_ROUTES
} from './App.routes';
import AppAuth from './AppAuth';
import AppLayers from './AppLayers';
import {GlobalStyles} from './App.styled';

import 'react-notifications/lib/notifications.css';
import 'react-toastify/dist/ReactToastify.css';

const App: FC = () => {
  const {configStore, authStore, themeStore, initApplication, unityStore, sentryStore} = useStore();
  const {configLoadingErrorCode} = configStore;
  const {unityInstanceStore} = unityStore;

  const {pathname} = useLocation<{pathname: string}>();
  const history = useHistory();
  const {t} = useTranslation();

  useApiHandlers();

  useEffect(() => {
    initApplication();
  }, [initApplication]);

  useEffect(() => {
    if (configStore.isConfigReady) {
      authStore.init();
      sentryStore.init();
      unityInstanceStore.init();
    }
  }, [authStore, configStore.isConfigReady, unityInstanceStore, sentryStore]);

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
        <Suspense fallback={false}>{createSwitchByConfig(SYSTEM_ROUTES)}</Suspense>
      </ThemeProvider>
    );
  }

  if (!configStore.isConfigReady || authStore.isAuthenticating) {
    return <></>;
  }

  // FIXME: Default url
  if (pathname === ROUTES.base) {
    return (
      <Switch>
        <Redirect to={ROUTES.explore} />
      </Switch>
    );
  }

  // PUBLIC ROUTES
  if (isTargetRoute(pathname, PUBLIC_ROUTES)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <GlobalStyles />
        <Suspense fallback={false}>{createSwitchByConfig(PUBLIC_ROUTES)}</Suspense>
      </ThemeProvider>
    );
  }

  // PRIVATE ROUTES WITH UNITY
  if (isTargetRoute(pathname, PRIVATE_ROUTES_WITH_UNITY)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <AppAuth>
          <GlobalStyles />
          <UnityPage />
          <Suspense fallback={false}>
            <AppLayers renderUnity>{createSwitchByConfig(PRIVATE_ROUTES_WITH_UNITY)}</AppLayers>
          </Suspense>
        </AppAuth>
      </ThemeProvider>
    );
  }

  // PRIVATE ROUTES
  return (
    <ThemeProvider theme={themeStore.theme}>
      <Suspense fallback={false}>
        <AppAuth>
          <GlobalStyles />
          <AppLayers>{createSwitchByConfig(PRIVATE_ROUTES, ROUTES.explore)}</AppLayers>
        </AppAuth>
      </Suspense>
    </ThemeProvider>
  );
};

export default observer(App);
