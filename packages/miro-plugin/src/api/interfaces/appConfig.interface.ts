/**
 * Main constants come from backend.
 */

export interface AppConfigInterface {
  BACKEND_ENDPOINT_URL: string;
  APP_ID: string;
}

/**
 * Additional constants are defined in app.variables.ts
 */

export interface AppConfigExtendedInterface extends AppConfigInterface {}
