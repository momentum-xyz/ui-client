/** GET CHALLENGE REQUEST **/

export interface ChallengeRequest {
  wallet: string;
}

export interface ChallengeResponse {
  challenge: string;
}

/** TOKEN REQUEST **/

export interface TokenRequest {
  challenge: string;
}

export interface TokenResponse {
  token: string;
}
