import React, {FC, Suspense, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate, useLocation} from 'react-router-dom';
import {ThemeProvider as ThemeProviderOriginal, ThemeProviderProps} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {isBrowserSupported} from '@momentum-xyz/core';
import {LoaderFallback} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useApiHandlers, useStore} from 'shared/hooks';
import {httpErrorCodes} from 'api/constants';
import {SystemWideError} from 'ui-kit';
import {createSwitchByConfig, isTargetRoute} from 'core/utils';
import {UnityPage} from 'scenes/unity';
import {PosBusService} from 'shared/services';

import {PRIVATE_ROUTES, PRIVATE_ROUTES_WITH_UNITY, SYSTEM_ROUTES} from './App.routes';
import AppAuth from './AppAuth';
import AppLayers from './AppLayers';
import {GlobalStyles as GlobalStylesOriginal} from './App.styled';
import {TestnetMarkWidget} from './widgets/pages';

import 'react-notifications/lib/notifications.css';
import 'react-toastify/dist/ReactToastify.css';

const ThemeProvider = ThemeProviderOriginal as unknown as FC<ThemeProviderProps<any, any>>;
const GlobalStyles = GlobalStylesOriginal as unknown as FC<any>;

const App: FC = () => {
  const rootStore = useStore();
  const {configStore, sessionStore, themeStore, sentryStore} = rootStore;
  const {configLoadingErrorCode} = configStore;

  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {t} = useTranslation();

  useApiHandlers();

  useEffect(() => {
    rootStore.initApplication();
  }, [rootStore]);

  useEffect(() => {
    if (configStore.isConfigReady) {
      sessionStore.init();
      sentryStore.init();
    }
  }, [sessionStore, configStore.isConfigReady, sentryStore]);

  const isBrowserUnsupported = !isBrowserSupported();

  useEffect(() => {
    if (isBrowserUnsupported) {
      navigate({pathname: ROUTES.system.wrongBrowser});
    }
  }, [isBrowserUnsupported, navigate]);

  useEffect(() => {
    if (sessionStore.errorFetchingProfile) {
      console.log('Error fetching profile. Wait couple of seconds and sign out and redirect.');
      setTimeout(() => {
        sessionStore.signOutRedirect();
      }, 5000);
    }
  }, [sessionStore, sessionStore.errorFetchingProfile]);

  useEffect(() => {
    if (sessionStore.token && sessionStore.user) {
      PosBusService.init(sessionStore.token, sessionStore.user.id);
    }
  }, [sessionStore.token, sessionStore.user]);

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
