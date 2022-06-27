import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {Web3ReactProvider} from '@web3-react/core';
import {ThemeProvider} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {Redirect, Switch, useLocation} from 'react-router-dom';
import {AuthProvider} from 'react-oidc-context';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {appVariables} from 'api/constants';
import {createRoutesByConfig, isBrowserSupported, isTargetRoute} from 'core/utils';
import {WrongBrowser} from 'ui-kit';

// TODO: To be refactored
import {AgoraProvider} from '../context/AgoraContext';
import {ConfirmationDialogProvider} from '../hooks/useConformationDialog';
import AuthComponent from '../context/Auth/AuthContext';
import {CollaborationProvider} from '../context/Collaboration/CollaborationContext';
import UnityComponent from '../context/Unity/UnityContext';
import {TextChatProvider} from '../context/TextChatContext';

import {CORE_ROUTES, PRIVATE_ROUTES, PUBLIC_ROUTES} from './AppRoutes';
import AppLayers from './AppLayers';

import 'react-notifications/lib/notifications.css';
import 'react-toastify/dist/ReactToastify.css';

// TODO: Refactoring. Move to separate service
AgoraRTC.setLogLevel(4);
const agoraClient = AgoraRTC.createClient({mode: 'rtc', codec: 'h264'});
const stageClient = AgoraRTC.createClient({mode: 'live', codec: 'vp8'});
stageClient.enableDualStream();

const App: FC = () => {
  const {configStore, sessionStore, mainStore, favoriteStore, initApplication} = useStore();
  const {themeStore, unityStore, sentryStore} = mainStore;
  const {isConfigReady} = configStore;

  const {pathname} = useLocation();
  const {t} = useTranslation();

  useEffect(() => {
    initApplication();
  }, [initApplication]);

  useEffect(() => {
    if (isConfigReady) {
      favoriteStore.init();
      sentryStore.init();
      unityStore.init();
    }
  }, [favoriteStore, isConfigReady, sentryStore, unityStore]);

  if (!isConfigReady) {
    return <></>;
  }

  if (!isBrowserSupported()) {
    return (
      <WrongBrowser
        title={t('wrongBrowser.title')}
        message={t('wrongBrowser.message')}
        browserList={t('wrongBrowser.browserList')}
      />
    );
  }

  // PUBLIC ROUTES
  if (isTargetRoute(pathname as string, PUBLIC_ROUTES)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <Web3ReactProvider getLibrary={sessionStore.getLibrary}>
          <Switch>{createRoutesByConfig(PUBLIC_ROUTES)}</Switch>
        </Web3ReactProvider>
      </ThemeProvider>
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
  if (isTargetRoute(pathname as string, CORE_ROUTES)) {
    return (
      <ThemeProvider theme={themeStore.theme}>
        <Web3ReactProvider getLibrary={sessionStore.getLibrary}>
          <AuthProvider {...sessionStore.oidcConfig}>
            <Switch>{createRoutesByConfig(CORE_ROUTES)}</Switch>
          </AuthProvider>
        </Web3ReactProvider>
      </ThemeProvider>
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

  // UNITY WAITING
  if (!unityStore.isInitialized || !unityStore.unityContext) {
    return <></>;
  }

  // PRIVATE ROUTES
  return (
    <ThemeProvider theme={themeStore.theme}>
      <Web3ReactProvider getLibrary={sessionStore.getLibrary}>
        <ConfirmationDialogProvider>
          <AuthProvider {...sessionStore.oidcConfig}>
            <AuthComponent>
              <CollaborationProvider>
                <AgoraProvider
                  client={agoraClient}
                  stageClient={stageClient}
                  appId={appVariables.AGORA_APP_ID}
                >
                  <TextChatProvider>
                    <UnityComponent unityContext={unityStore.unityContext} />
                    <AppLayers>
                      <Switch>
                        {createRoutesByConfig(PRIVATE_ROUTES)}
                        <Redirect to={ROUTES.base} />
                      </Switch>
                    </AppLayers>
                  </TextChatProvider>
                </AgoraProvider>
              </CollaborationProvider>
            </AuthComponent>
          </AuthProvider>
        </ConfirmationDialogProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
};

export default observer(App);
