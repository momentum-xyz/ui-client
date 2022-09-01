export interface ValidationRequest {
  name: string;
}

export interface ValidationResponse {
  valid: boolean;
  error?: string;
}

export interface ValidateDomainNameResponse extends ValidationRequest {
  main_domain?: string;
}
