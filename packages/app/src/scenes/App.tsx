/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, Suspense, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate, useLocation} from 'react-router-dom';
import {ThemeProvider as ThemeProviderOriginal, ThemeProviderProps} from 'styled-components';
import {isBrowserSupported, useI18n} from '@momentum-xyz/core';
import {LoaderFallback} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useApiHandlers, useStore} from 'shared/hooks';
import {httpErrorCodes} from 'api/constants';
import {SystemWideError, Toast} from 'ui-kit';
import {createSwitchByConfig, isTargetRoute} from 'core/utils';
import {WorldPage} from 'scenes/world';
import {Map3dPage} from 'scenes/map3d';
import {WelcomePage} from 'scenes/welcome';

import AppAuth from './AppAuth';
import AppLayers from './AppLayers';
import {WidgetManager} from './widgetManager';
import {GlobalStyles as GlobalStylesOriginal} from './App.styled';
import {UNIVERSE_ROUTES, WORLD_ROUTES, SYSTEM_ROUTES} from './App.routes';
import {
  HAS_SEEN_WELCOME_PAGE_LS_KEY,
  HAS_SEEN_WELCOME_PAGE_LS_VALUE
} from './welcome/pages/Welcome/WelcomePage';

const ThemeProvider = ThemeProviderOriginal as unknown as FC<ThemeProviderProps<any, any>>;
const GlobalStyles = GlobalStylesOriginal as unknown as FC;

const App: FC = () => {
  const rootStore = useStore();
  const {configStore, sessionStore, themeStore, sentryStore} = rootStore;
  const {configLoadingErrorCode} = configStore;

  const isBrowserUnsupported = !isBrowserSupported();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {t} = useI18n();

  const isWelcomePage = pathname === ROUTES.welcome;
  const hasSeenWelcomePage =
    localStorage.getItem(HAS_SEEN_WELCOME_PAGE_LS_KEY) === HAS_SEEN_WELCOME_PAGE_LS_VALUE;

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

  useEffect(() => {
    if (isBrowserUnsupported) {
      navigate({pathname: ROUTES.system.wrongBrowser});
    }
  }, [isBrowserUnsupported, navigate]);

  useEffect(() => {
    const shouldGoToWelcomePage = sessionStore.isGuest && !isWelcomePage && !hasSeenWelcomePage;
    if (shouldGoToWelcomePage) {
      navigate(ROUTES.welcome);
    }
  }, [hasSeenWelcomePage, isWelcomePage, navigate, sessionStore.isGuest]);

  useEffect(() => {
    if (sessionStore.errorFetchingProfile) {
      console.log('Error fetching profile. Wait couple of seconds and sign out and redirect.');
      setTimeout(() => {
        sessionStore.signOutRedirect();
      }, 5000);
    }
  }, [sessionStore, sessionStore.errorFetchingProfile]);

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
      </ThemeProvider>
    );
  }

  if (!configStore.isConfigReady || sessionStore.isAuthenticating) {
    return <></>;
  }

  return (
    <ThemeProvider theme={themeStore.theme}>
      <AppAuth>
        <GlobalStyles />
        {isTargetRoute(pathname, WORLD_ROUTES) ? (
          <>
            <Toast />
            <WorldPage />
            <WidgetManager isWorld />
            <Suspense fallback={<LoaderFallback text={t('messages.loading')} />}>
              <AppLayers>{createSwitchByConfig(WORLD_ROUTES)}</AppLayers>
            </Suspense>
          </>
        ) : (
          <>
            <Toast />
            {isWelcomePage ? <WelcomePage /> : <Map3dPage />}
            <WidgetManager isWelcomePage={isWelcomePage} />
            <Suspense fallback={<LoaderFallback text={t('messages.loading')} />}>
              <AppLayers>{createSwitchByConfig(UNIVERSE_ROUTES)}</AppLayers>
            </Suspense>
          </>
        )}
      </AppAuth>
    </ThemeProvider>
  );
};

export default observer(App);
