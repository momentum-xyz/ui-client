/** GUEST LOGIN **/

export interface GuestLoginRequest {
  challenge: string;
}

export interface GuestLoginResponse {
  redirect: string;
}

/** GUEST CONSENT **/

export interface GuestConsentRequest {
  challenge: string;
}

export interface GuestConsentResponse {
  redirect: string;
}
