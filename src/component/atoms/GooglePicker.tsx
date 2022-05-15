import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

require('../../styles/atoms/_google-picker.scss');

let scriptLoadingStarted = false;

const useGooglePicker = ({
  // @ts-ignore
  authImmediate,
  // @ts-ignore
  clientId,
  // @ts-ignore
  developerKey,
  // @ts-ignore
  disabled,
  // @ts-ignore
  origin,
  // @ts-ignore
  onChange,
  // @ts-ignore
  onAuthenticate,
  // @ts-ignore
  onAuthFailed,
  // @ts-ignore
  createPicker,
  // @ts-ignore
  mimeTypes,
  // @ts-ignore
  multiselect,
  // @ts-ignore
  scope,
  // @ts-ignore
  navHidden,
  // @ts-ignore
  viewId,
  // @ts-ignore
  query
}) => {
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
      // google api is already exists
      // init immediately
      onApiLoad();
    } else if (!scriptLoadingStarted) {
      // load google api and the init
      scriptLoadingStarted = true;
      loadScript(window._env_.GOOGLE_SDK_URL, onApiLoad);
    } else {
      // is loading
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
    onAuthenticate(oauthToken);

    if (createPicker) {
      return createPicker((window as any).google, oauthToken);
    }

    const googleViewId = (window as any).google.picker.ViewId[viewId];
    const view = new (window as any).google.picker.View(googleViewId);

    if (mimeTypes) {
      view.setMimeTypes(mimeTypes.join(','));
    }
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
  const onChoose = () => {
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
          onAuthFailed(response);
        }
      });
    }
  };

  return {
    onChoose
  };
};

//export default useGooglePicker;

const GooglePicker = ({
  // @ts-ignore
  authImmediate,
  // @ts-ignore
  children,
  // @ts-ignore
  clientId,
  // @ts-ignore
  developerKey,
  // @ts-ignore
  disabled,
  // @ts-ignore
  origin,
  // @ts-ignore
  onChange,
  // @ts-ignore
  onAuthenticate,
  // @ts-ignore
  onAuthFailed,
  // @ts-ignore
  createPicker,
  // @ts-ignore
  mimeTypes,
  // @ts-ignore
  multiselect,
  // @ts-ignore
  scope,
  // @ts-ignore
  navHidden,
  // @ts-ignore
  viewId,
  // @ts-ignore
  query
}) => {
  const {onChoose} = useGooglePicker({
    authImmediate,
    clientId,
    developerKey,
    disabled,
    origin,
    onChange,
    onAuthenticate,
    onAuthFailed,
    createPicker,
    mimeTypes,
    multiselect,
    scope,
    navHidden,
    viewId,
    query
  });

  return <div onClick={onChoose}>{children}</div>;
};

GooglePicker.propTypes = {
  // children: PropTypes.node,
  clientId: PropTypes.string.isRequired,
  developerKey: PropTypes.string,
  scope: PropTypes.array,
  viewId: PropTypes.string,
  authImmediate: PropTypes.bool,
  origin: PropTypes.string,
  onChange: PropTypes.func,
  onAuthenticate: PropTypes.func,
  onAuthFailed: PropTypes.func,
  createPicker: PropTypes.func,
  mimeTypes: PropTypes.arrayOf(PropTypes.string),
  multiselect: PropTypes.bool,
  navHidden: PropTypes.bool,
  disabled: PropTypes.bool
};

GooglePicker.defaultProps = {
  onChange: () => {},
  onAuthenticate: () => {},
  onAuthFailed: () => {},
  scope: ['https://www.googleapis.com/auth/drive.readonly'],
  viewId: 'DOCS',
  authImmediate: false,
  multiselect: false,
  navHidden: false,
  disabled: false
};

export default GooglePicker;
