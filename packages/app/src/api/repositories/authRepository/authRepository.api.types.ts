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
  network?: string;
}

export interface AuthTokenResponse {
  token: string;
}

/** GUEST TOKEN REQUEST **/

export interface AuthGuestTokenRequest {}

export interface AuthGuestTokenResponse {
  token: string;
}
