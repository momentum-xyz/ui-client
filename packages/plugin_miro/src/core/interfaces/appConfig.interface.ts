/**
 * Main constants come from backend.
 */

import {PluginConfigInterface} from '@momentum-xyz/sdk';

export interface AppConfigInterface extends PluginConfigInterface {
  MIRO_APP_ID: string;
}

/**
 * Additional constants are defined in app.variables.ts
 */

export interface AppConfigExtendedInterface extends AppConfigInterface {}
