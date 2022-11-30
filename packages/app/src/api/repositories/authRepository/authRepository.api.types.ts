/** GET CHALLENGE REQUEST **/

export interface AuthChallengeRequest {
  wallet: string;
}

export interface AuthChallengeResponse {
  challenge: string;
}

/** TOKEN REQUEST **/

export interface AuthTokenRequest {
  wallet: string;
  signedChallenge: string;
}

export interface AuthTokenResponse {
  token: string;
}

/** GUEST TOKEN REQUEST **/

export interface AuthGuestTokenRequest {
  name: string;
}

export interface AuthGuestTokenResponse {
  token: string;
}
