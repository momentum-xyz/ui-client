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
