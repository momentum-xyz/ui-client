import {useEffect} from 'react';

import {appVariables} from 'api/constants';

let scriptLoadingStarted = false;

export const useGooglePicker = (onChange: (data: any) => void) => {
  const clientId = appVariables.GOOGLE_API_CLIENT_ID;
  const developerKey = appVariables.GOOGLE_API_DEVELOPER_KEY;
  const scope = ['https://www.googleapis.com/auth/drive.file'];
  const multiselect = false;
  const navHidden = false;
  const authImmediate = false;
  const disabled = false;
  const query = '';
  const viewId = 'DOCS';
  const origin = '';

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
    } else if (!scriptLoadingStarted) {
      scriptLoadingStarted = true;
      loadScript(appVariables.GOOGLE_SDK_URL, onApiLoad);
    }
  }, []);

  // @ts-ignore
  const doAuth = (callback) => {
    (window as any).gapi.auth.authorize(
      {
        client_id: clientId,
        scope: scope,
        immediate: authImmediate
      },
      callback
    );
  };

  // @ts-ignore
  const handleCreatePicker = (oauthToken) => {
    const googleViewId = (window as any).google.picker.ViewId[viewId];
    const view = new (window as any).google.picker.View(googleViewId);

    view.setMimeTypes([]);

    if (query) {
      view.setQuery(query);
    }

    if (!view) {
      throw new Error("Can't find view by viewId");
    }

    const picker = new (window as any).google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(developerKey)
      .setCallback(onChange);

    if (origin) {
      picker.setOrigin(origin);
    }

    if (navHidden) {
      picker.enableFeature((window as any).google.picker.Feature.NAV_HIDDEN);
    }

    if (multiselect) {
      picker.enableFeature((window as any).google.picker.Feature.MULTISELECT_ENABLED);
    }

    picker.build().setVisible(true);
  };

  // @ts-ignore: refactoring
  const pickDocument = () => {
    if (!isGoogleReady() || !isGoogleAuthReady() || !isGooglePickerReady() || disabled) {
      return null;
    }

    const token = (window as any).gapi.auth.getToken();
    const oauthToken = token && token.access_token;

    if (oauthToken) {
      handleCreatePicker(oauthToken);
    } else {
      // @ts-ignore
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
