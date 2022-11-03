import {AppConfigExtendedInterface} from 'core/interfaces';

export const appVariables: AppConfigExtendedInterface = {
  MIRO_APP_ID: ''
};

const {REACT_APP_OVERRIDE_CONFIG_VARIABLES = '{}'} = process.env;

export const appVariablesOverrides = JSON.parse(
  REACT_APP_OVERRIDE_CONFIG_VARIABLES
) as Partial<AppConfigExtendedInterface>;
