/**
 * Main constants come from backend.
 */

import {PluginConfigInterface} from '@momentum-xyz/sdk';

export interface AppConfigInterface extends PluginConfigInterface {
  GOOGLE_SDK_URL: string;
  GOOGLE_API_CLIENT_ID: string;
  GOOGLE_DOCUMENT_SCOPE: string;
  GOOGLE_API_DEVELOPER_KEY: string;
}

/**
 * Additional constants are defined in app.variables.ts
 */

export interface AppConfigExtendedInterface extends AppConfigInterface {}
