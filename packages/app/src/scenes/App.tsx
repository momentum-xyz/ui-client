import {FC, Suspense, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate, useLocation} from 'react-router-dom';
import {ThemeProvider as ThemeProviderOriginal, ThemeProviderProps} from 'styled-components';
import {isBrowserSupported, useI18n} from '@momentum-xyz/core';
import {LoaderFallback, SystemWideError, GlobalStyles} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useApiHandlers, useStore} from 'shared/hooks';
import {httpErrorCodes} from 'api/constants';
import {Toast} from 'ui-kit';
import {createSwitchByConfig, isTargetRoute} from 'core/utils';
import {World3dPage} from 'scenes/world';
import {Universe3dPage} from 'scenes/universe';

import AppAuth from './AppAuth';
import {WidgetManager} from './widgetManager';
import {UNIVERSE_ROUTES, WORLD_ROUTES, SYSTEM_ROUTES, ADMIN_ROUTES} from './App.routes';
import {WelcomePage} from './welcome';

const ThemeProvider = ThemeProviderOriginal as unknown as FC<ThemeProviderProps<any, any>>;

const App: FC = () => {
  const rootStore = useStore();
  const {configStore, sessionStore, themeStore, sentryStore} = rootStore;
  const {configLoadingErrorCode} = configStore;

  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {t} = useI18n();

  const isBrowserUnsupported = !isBrowserSupported();
  const isWelcomePage = pathname === ROUTES.welcome;

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
        <Toast />
        {isTargetRoute(pathname, ADMIN_ROUTES) ? (
          <>
            <Suspense fallback={<LoaderFallback text={t('messages.loading')} />}>
              <main>{createSwitchByConfig(ADMIN_ROUTES)}</main>
            </Suspense>
          </>
        ) : isTargetRoute(pathname, WORLD_ROUTES) ? (
          <>
            <World3dPage />
            <WidgetManager isWorld />
            <Suspense fallback={<LoaderFallback text={t('messages.loading')} />}>
              <main>{createSwitchByConfig(WORLD_ROUTES)}</main>
            </Suspense>
          </>
        ) : (
          <>
            <Universe3dPage />
            {isWelcomePage && <WelcomePage />}
            <WidgetManager isWelcomePage={isWelcomePage} />
            <Suspense fallback={<LoaderFallback text={t('messages.loading')} />}>
              <main>{createSwitchByConfig(UNIVERSE_ROUTES)}</main>
            </Suspense>
          </>
        )}
      </AppAuth>
    </ThemeProvider>
  );
};

export default observer(App);
