import React, {FC, Suspense, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Redirect, Switch, useHistory, useLocation} from 'react-router-dom';
import {AuthProvider} from 'react-oidc-context';
import {Web3ReactProvider} from '@web3-react/core';
import {ThemeProvider} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {isBrowserSupported} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {httpErrorCodes} from 'api/constants';
import {REQUEST_MAX_RETRIES, REQUEST_RETRY_DELAY_BASE, setApiResponseHandlers} from 'api/request';
import {SystemWideError, ToastContent} from 'ui-kit';
import {createSwitchByConfig, isTargetRoute} from 'core/utils';
import {UnityPage} from 'scenes/unity';

import AppAuth from './AppAuth';
import AppLayers from './AppLayers';
import {GlobalStyles} from './App.styled';
import {
  CORE_ROUTES,
  PRIVATE_ROUTES,
  PRIVATE_ROUTES_WITH_UNITY,
  PUBLIC_ROUTES,
  SYSTEM_ROUTES
} from './App.routes';

import 'react-notifications/lib/notifications.css';
import 'react-toastify/dist/ReactToastify.css';

const App: FC = () => {
  const {configStore, sessionStore, mainStore, initApplication} = useStore();
  const {themeStore} = mainStore;
  const {errorCode: configLoadingErrorCode} = configStore;

  const {pathname} = useLocation<{pathname: string}>();
  const history = useHistory();
  const {t} = useTranslation();

  useEffect(() => {
    setApiResponseHandlers({
      maxRetries: REQUEST_MAX_RETRIES,
      retryDelayBase: REQUEST_RETRY_DELAY_BASE,
      retryCodes: [httpErrorCodes.MAINTENANCE],
      // this is called after retrying failed request if the error code matches retryCodes or if it doesn't match
      onError: (error) => {
        const status = error.response?.status;

        console.error('API Error:', {error, status, config: error.config});
        if (
          status &&
          [httpErrorCodes.INTERNAL_SYSTEM_ERROR, httpErrorCodes.MAINTENANCE].includes(status)
        ) {
          toast.info(
            <ToastContent
              headerIconName="check"
              title={String(error.response?.status || '')}
              text={
                status === httpErrorCodes.MAINTENANCE
                  ? t('systemMessages.underMaintenance')
                  : t('errors.somethingWentWrong')
              }
              showCloseButton
            />
          );
        }
        throw error;
      }
    });

    initApplication();
  }, [initApplication, history, t]);

  useEffect(() => {
    if (configStore.isConfigReady) {
      mainStore.init();
    }
  }, [configStore.isConfigReady, mainStore]);

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

  // SYSTEM ROUTES
  if (isTargetRoute(pathname, SYSTEM_ROUTES)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <Suspense fallback={false}>{createSwitchByConfig(SYSTEM_ROUTES)}</Suspense>
      </ThemeProvider>
    );
  }

  if (!configStore.isConfigReady) {
    return <></>;
  }

  // PUBLIC ROUTES
  if (isTargetRoute(pathname, PUBLIC_ROUTES)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <Web3ReactProvider getLibrary={sessionStore.getLibrary}>
          <Suspense fallback={false}>{createSwitchByConfig(PUBLIC_ROUTES)}</Suspense>
        </Web3ReactProvider>
      </ThemeProvider>
    );
  }

  // NO OIDC CONFIG AND WORLD BUILDER
  if (!sessionStore.oidcConfig && pathname === ROUTES.worldBuilder.base) {
    return (
      <Switch>
        <Redirect to={{pathname: ROUTES.worldBuilder.login, state: {from: pathname}}} />
      </Switch>
    );
  }

  // NO OIDC CONFIG
  if (!sessionStore.oidcConfig) {
    return (
      <Switch>
        <Redirect to={{pathname: ROUTES.login, state: {from: pathname}}} />
      </Switch>
    );
  }

  // CORE ROUTES
  if (isTargetRoute(pathname, CORE_ROUTES)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <Web3ReactProvider getLibrary={sessionStore.getLibrary}>
          <AuthProvider {...sessionStore.oidcConfig}>
            <Suspense fallback={false}>{createSwitchByConfig(CORE_ROUTES)}</Suspense>
          </AuthProvider>
        </Web3ReactProvider>
      </ThemeProvider>
    );
  }

  // NO OIDC CONFIG AND WORLD BUILDER
  if (!sessionStore.isSessionExists && pathname === ROUTES.worldBuilder.base) {
    return (
      <Switch>
        <Redirect to={{pathname: ROUTES.worldBuilder.login, state: {from: pathname}}} />
      </Switch>
    );
  }

  // NO OIDC USER. To await white screen
  if (!sessionStore.isSessionExists) {
    return (
      <Switch>
        <Redirect to={{pathname: ROUTES.login, state: {from: pathname}}} />
      </Switch>
    );
  }

  // PRIVATE ROUTES
  if (isTargetRoute(pathname, PRIVATE_ROUTES)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <Web3ReactProvider getLibrary={sessionStore.getLibrary}>
          <AuthProvider {...sessionStore.oidcConfig}>
            <Suspense fallback={false}>
              <AppAuth>
                <GlobalStyles />
                <AppLayers withUnity={false} withMeeting={false} withWidgets={false}>
                  {createSwitchByConfig(PRIVATE_ROUTES, ROUTES.base)}
                </AppLayers>
              </AppAuth>
            </Suspense>
          </AuthProvider>
        </Web3ReactProvider>
      </ThemeProvider>
    );
  }

  // PRIVATE ROUTES WITH UNITY
  return (
    <ThemeProvider theme={themeStore.theme}>
      <Web3ReactProvider getLibrary={sessionStore.getLibrary}>
        <AuthProvider {...sessionStore.oidcConfig}>
          <AppAuth>
            <GlobalStyles />
            <UnityPage />
            <Suspense fallback={false}>
              <AppLayers>{createSwitchByConfig(PRIVATE_ROUTES_WITH_UNITY, ROUTES.base)}</AppLayers>
            </Suspense>
          </AppAuth>
        </AuthProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
};

export default observer(App);
