/** GET LOGIN HINT **/

export interface Web3LoginHintRequest {
  login_challenge: string;
}

export interface Web3LoginHintResponse {
  loginHint: string;
}

/** GET LOGIN HINT BY CONSENT **/

export interface Web3LoginHintConsentRequest {
  consent_challenge: string;
}

export interface Web3LoginHintConsentResponse {
  loginHint: string;
}

/** WEB3 CHALLENGE **/

export interface Web3ChallengeRequest {
  login_challenge: string;
  address: string;
}

export interface Web3ChallengeResponse {
  address_challenge: string;
}

/** WEB3 LOGIN ACCEPT **/

export interface Web3LoginAcceptRequest {
  signed_address_challenge: string;
  login_challenge: string;
  wallet_type?: string;
}

export interface Web3LoginAcceptResponse {
  redirect: string;
}

/** WEB3 CONSENT **/

export interface Web3ConsentAcceptRequest {
  consent_challenge: string;
}

export interface Web3ConsentAcceptResponse {
  redirect: string;
}

/** Mint NFT */

export interface MintNftRequest {
  name: string;
  image: string;
  block_hash: string;
  wallet: string;
}

export interface MintNftResponse {
  job_id: string;
}

export interface MintNftCheckJobRequest {
  job_id: string;
}

export interface MintNftCheckJobResponse {
  status: string;
  nodeJSOut: string;
}
