import React, {FC, Suspense, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate, useLocation} from 'react-router-dom';
import {ThemeProvider as ThemeProviderOG, ThemeProviderProps} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {isBrowserSupported} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {useApiHandlers, useStore} from 'shared/hooks';
import {httpErrorCodes} from 'api/constants';
import {SystemWideError} from 'ui-kit';
import {createSwitchByConfig, isTargetRoute} from 'core/utils';
import {UnityPage} from 'scenes/unity';

import {PRIVATE_ROUTES, PRIVATE_ROUTES_WITH_UNITY, SYSTEM_ROUTES} from './App.routes';
import AppAuth from './AppAuth';
import AppLayers from './AppLayers';
import {GlobalStyles as GlobalStylesOG} from './App.styled';
import {TestnetMarkWidget} from './widgets/pages';

import 'react-notifications/lib/notifications.css';
import 'react-toastify/dist/ReactToastify.css';

const ThemeProvider = ThemeProviderOG as unknown as FC<ThemeProviderProps<any, any>>;
const GlobalStyles = GlobalStylesOG as unknown as FC<any>;

const App: FC = () => {
  const rootStore = useStore();
  const {configStore, sessionStore, themeStore, unityStore, sentryStore} = rootStore;
  const {configLoadingErrorCode} = configStore;
  const {unityInstanceStore} = unityStore;

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
      unityInstanceStore.init();
    }
  }, [sessionStore, configStore.isConfigReady, unityInstanceStore, sentryStore]);

  const isBrowserUnsupported = !isBrowserSupported();

  useEffect(() => {
    if (isBrowserUnsupported) {
      navigate({pathname: ROUTES.system.wrongBrowser});
    }
  }, [isBrowserUnsupported, navigate]);

  if (configStore.isError && !configStore.isConfigReady) {
    return (
      <>
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
      </>
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
        <TestnetMarkWidget withOffset />
      </ThemeProvider>
    );
  }

  if (!configStore.isConfigReady || sessionStore.isAuthenticating) {
    return <></>;
  }

  // // FIXME: Default url
  // if (pathname === ROUTES.base) {
  //   return (
  //     <Routes>
  //       <Route path="*" element={<Navigate to={ROUTES.explore} replace />} />
  //     </Routes>
  //   );
  // }

  // // PUBLIC ROUTES
  // if (isTargetRoute(pathname, PUBLIC_ROUTES)) {
  //   return (
  //     <ThemeProvider theme={themeStore.theme}>
  //       <GlobalStyles />
  //       <Suspense fallback={false}>{createSwitchByConfig(PUBLIC_ROUTES)}</Suspense>
  //       <TestnetMarkWidget />
  //     </ThemeProvider>
  //   );
  // }

  // PRIVATE ROUTES WITH UNITY
  if (isTargetRoute(pathname, PRIVATE_ROUTES_WITH_UNITY)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <Suspense fallback={false}>
          <AppAuth>
            <GlobalStyles />
            <UnityPage />
            <AppLayers renderUnity>{createSwitchByConfig(PRIVATE_ROUTES_WITH_UNITY)}</AppLayers>
            <TestnetMarkWidget withOffset />
          </AppAuth>
        </Suspense>
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
          <TestnetMarkWidget />
        </AppAuth>
      </Suspense>
    </ThemeProvider>
  );
};

export default observer(App);
