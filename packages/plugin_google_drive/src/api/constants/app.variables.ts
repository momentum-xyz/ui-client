import {PluginConfigDescriptionInterface} from '@momentum-xyz/sdk';
import {AppConfigExtendedInterface} from 'core/interfaces';

export const appVariables: AppConfigExtendedInterface = {
  GOOGLE_API_CLIENT_ID: '',
  GOOGLE_API_DEVELOPER_KEY: '',
  GOOGLE_SDK_URL: 'https://apis.google.com/js/api.js',
  GOOGLE_DOCUMENT_SCOPE: 'https://www.googleapis.com/auth/drive.file'
};

export const configDescription: PluginConfigDescriptionInterface = {
  GOOGLE_API_CLIENT_ID: {
    displayName: 'Client Id',
    type: 'string',
    required: true,
    description: 'Your Google API Client Id'
  },
  GOOGLE_API_DEVELOPER_KEY: {
    displayName: 'Developer Key',
    type: 'string',
    required: true,
    description: 'Your Google API Developer Key'
  }
};
