import {AppConfigExtendedInterface} from 'api/interfaces';

// @ts-ignore window['env']
export const appVariables: AppConfigExtendedInterface = window['env'] ?? {
  BACKEND_ENDPOINT_URL: '',
  APP_ID: ''
};

const {REACT_APP_OVERRIDE_CONFIG_VARIABLES = '{}'} = process.env;

export const appVariablesOverrides = JSON.parse(
  REACT_APP_OVERRIDE_CONFIG_VARIABLES
) as Partial<AppConfigExtendedInterface>;
