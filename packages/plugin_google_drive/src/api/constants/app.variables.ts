import {AppConfigExtendedInterface} from 'core/interfaces';

export const appVariables: AppConfigExtendedInterface = {
  GOOGLE_SDK_URL: '',
  GOOGLE_API_CLIENT_ID: '',
  GOOGLE_DOCUMENT_SCOPE: '',
  GOOGLE_API_DEVELOPER_KEY: ''
};

const {REACT_APP_OVERRIDE_CONFIG_VARIABLES = '{}'} = process.env;

export const appVariablesOverrides = JSON.parse(
  REACT_APP_OVERRIDE_CONFIG_VARIABLES
) as Partial<AppConfigExtendedInterface>;
