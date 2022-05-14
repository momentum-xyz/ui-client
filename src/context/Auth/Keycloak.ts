import Keycloak, {KeycloakInstance} from 'keycloak-js';

// Create a global singelton instance of het Keycloak client
// The auth provider wil init
const keycloak: KeycloakInstance = Keycloak({
  url: window._env_.AUTH_SERVICE_URL,
  realm: 'Momentum',
  clientId: 'react-client'
});

export default keycloak;
