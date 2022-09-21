import {useEffect, useRef} from 'react';

import {appVariables} from 'api/constants';

const DOCUMENT_VIEW_ID = 'DOCS';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowWithGapi: Window & {gapi?: any; google?: any} = window;

export const useGooglePicker = (onChange: (data: unknown) => void) => {
  const scriptLoadingStarted = useRef<boolean>(false);

  const onApiLoad = () => {
    windowWithGapi.gapi.load('auth');
    windowWithGapi.gapi.load('picker');
  };

  const isGoogleReady = () => {
    return !!windowWithGapi.gapi;
  };

  const isGoogleAuthReady = () => {
    return !!windowWithGapi.gapi.auth;
  };

  const isGooglePickerReady = () => {
    return !!windowWithGapi.google.picker;
  };

  const loadScript = (src: string, onLoad: () => void) => {
    const script = document.createElement(`script`);
    script.src = src;
    script.async = true;
    script.defer = true;
    script.addEventListener(`load`, onLoad);
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (isGoogleReady()) {
      onApiLoad();
    } else if (!scriptLoadingStarted.current) {
      scriptLoadingStarted.current = true;
      loadScript(appVariables.GOOGLE_SDK_URL, onApiLoad);
    }
  }, []);

  const doAuth = (callback: (data: {access_token?: string}) => void) => {
    const config = {
      client_id: appVariables.GOOGLE_API_CLIENT_ID,
      scope: [appVariables.GOOGLE_DOCUMENT_SCOPE],
      immediate: false
    };

    windowWithGapi.gapi.auth.authorize(config, callback);
  };

  const handleCreatePicker = (oauthToken: string) => {
    const googleViewId = windowWithGapi.google.picker.ViewId[DOCUMENT_VIEW_ID];
    const view = new windowWithGapi.google.picker.View(googleViewId);

    view.setMimeTypes([]);

    if (!view) {
      throw new Error("Can't find view by viewId");
    }

    const picker = new windowWithGapi.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(appVariables.GOOGLE_API_DEVELOPER_KEY)
      .setCallback(onChange);

    picker.build().setVisible(true);
  };

  const pickDocument = () => {
    if (!isGoogleReady() || !isGoogleAuthReady() || !isGooglePickerReady()) {
      return;
    }

    const token = windowWithGapi.gapi.auth.getToken();
    const oauthToken = token && token.access_token;

    if (oauthToken) {
      handleCreatePicker(oauthToken);
    } else {
      doAuth((response) => {
        if (response.access_token) {
          handleCreatePicker(response.access_token);
        } else {
          console.info('on auth failed:', response);
        }
      });
    }
  };

  return {pickDocument};
};
