import {useEffect, useRef} from 'react';

import {appVariables} from 'api/constants';

const DOCUMENT_VIEW_ID = 'DOCS';

export const useGooglePicker = (onChange: (data: any) => void) => {
  const scriptLoadingStarted = useRef<boolean>(false);

  const onApiLoad = () => {
    (window as any).gapi.load('auth');
    (window as any).gapi.load('picker');
  };

  const isGoogleReady = () => {
    return !!(window as any).gapi;
  };

  const isGoogleAuthReady = () => {
    return !!(window as any).gapi.auth;
  };

  const isGooglePickerReady = () => {
    return !!(window as any).google.picker;
  };

  const loadScript = (src: string, onLoad: () => void) => {
    const script = document.createElement(`script`);
    script.src = src;
    script.async = true;
    script.defer = true;
    script.addEventListener(`load`, onLoad);
    (document.head as any).appendChild(script);
  };

  useEffect(() => {
    if (isGoogleReady()) {
      onApiLoad();
    } else if (!scriptLoadingStarted.current) {
      scriptLoadingStarted.current = true;
      loadScript(appVariables.GOOGLE_SDK_URL, onApiLoad);
    }
  }, []);

  const doAuth = (callback: (data: any) => void) => {
    const config = {
      client_id: appVariables.GOOGLE_API_CLIENT_ID,
      scope: [appVariables.GOOGLE_DOCUMENT_SCOPE],
      immediate: false
    };

    (window as any).gapi.auth.authorize(config, callback);
  };

  const handleCreatePicker = (oauthToken: string) => {
    const googleViewId = (window as any).google.picker.ViewId[DOCUMENT_VIEW_ID];
    const view = new (window as any).google.picker.View(googleViewId);

    view.setMimeTypes([]);

    if (!view) {
      throw new Error("Can't find view by viewId");
    }

    const picker = new (window as any).google.picker.PickerBuilder()
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

    const token = (window as any).gapi.auth.getToken();
    const oauthToken = token && token.access_token;

    if (oauthToken) {
      handleCreatePicker(oauthToken);
    } else {
      doAuth((response: any) => {
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
