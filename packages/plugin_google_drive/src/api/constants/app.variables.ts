import {AppConfigExtendedInterface} from 'core/interfaces';

export const appVariables: AppConfigExtendedInterface = {
  GOOGLE_API_CLIENT_ID: '',
  GOOGLE_API_DEVELOPER_KEY: '',
  GOOGLE_SDK_URL: 'https://apis.google.com/js/api.js',
  GOOGLE_DOCUMENT_SCOPE: 'https://www.googleapis.com/auth/drive.file'
};

const {REACT_APP_OVERRIDE_CONFIG_VARIABLES = '{}'} = process.env;

export const appVariablesOverrides = JSON.parse(
  REACT_APP_OVERRIDE_CONFIG_VARIABLES
) as Partial<AppConfigExtendedInterface>;
