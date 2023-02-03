import {PluginConfigDescriptionInterface} from '@momentum-xyz/sdk';
import {AppConfigExtendedInterface} from 'core/interfaces';

export const appVariables: AppConfigExtendedInterface = {
  MIRO_APP_ID: ''
};

export const configDescription: PluginConfigDescriptionInterface = {
  MIRO_APP_ID: {
    type: 'string',
    required: true,
    description: 'Miro App/Client Id'
  }
};
