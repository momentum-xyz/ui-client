#!/bin/sh

OUTPUT='./env-config.js'

# Recreate config file
rm -rf $OUTPUT
touch $OUTPUT

echo "var base_url = window.location.protocol + \"//\" + window.location.host;" >> $OUTPUT

echo "window._env_ = {" >> $OUTPUT

echo "DEPLOYMENT_BASE_URL: base_url," >> $OUTPUT
echo "COOKIE_BASE_URL: \"dev.odyssey.ninja\"," >> $OUTPUT
echo "RENDER_SERVICE_URL: base_url+\"/api/v3/render\"," >> $OUTPUT
echo "REACT_APP_AUTH_REDIRECT_URI: base_url," >> $OUTPUT
echo "BACKEND_ENDPOINT_URL: base_url+\"/api/v3/backend\"," >> $OUTPUT
echo "UNITY_CLIENT_URL : base_url+\"/unity\"," >> $OUTPUT
echo "KEYCLOAK_OPENID_CONNECT_URL: \"https://dev-x5u42do.odyssey.ninja/auth/realms/Momentum/\"," >> $OUTPUT
echo "KEYCLOAK_OPENID_CLIENT_ID: \"react-client\"," >> $OUTPUT
echo "KEYCLOAK_OPENID_SCOPE: \"openid offline_access\"," >> $OUTPUT
echo "OPENID_REDIRECT_URL : base_url+\"/oidc/callback\"," >> $OUTPUT
echo "HYDRA_OPENID_CONNECT_URL: \"https://oidc.dev.odyssey.ninja/\"," >> $OUTPUT
echo "HYDRA_OPENID_CLIENT_ID: \"8ad3d327-e2cf-4828-80c2-d218cf6a547d\"," >> $OUTPUT
echo "HYDRA_OPENID_GUEST_CLIENT_ID: \"93f4f607-a56d-4689-947a-0529630167ad\"," >> $OUTPUT
echo "HYDRA_OPENID_SCOPE: \"openid offline\"," >> $OUTPUT
echo "WEB3_IDENTITY_PROVIDER_URL: \"https://dev.odyssey.ninja/web3-idp\"," >> $OUTPUT
echo "GUEST_IDENTITY_PROVIDER_URL: \"https://dev.odyssey.ninja/guest-idp\"," >> $OUTPUT
echo "GOOGLE_SDK_URL: \"https://apis.google.com/js/api.js\"," >> $OUTPUT
echo "SENTRY_DSN: \"\"," >> $OUTPUT

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]]; do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
    # Read value of current variable if exists as Environment variable
    varname1=$varname
    value=$(eval echo \$$varname1)
    # value=$(printf '%s\n' "${!varname}")
    # Otherwise use value from .env file
    [[ -z $value ]] && value=${varvalue}

    # Append configuration property to JS file
    echo "  $varname: \"$value\"," >> $OUTPUT
  fi

done <.env.base

echo "}" >> $OUTPUT
