export interface TemplateInterface {
  id: string;
  name: string;
  description: string;
  image: string;
}

//  VALIDATION

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

// TEMPLATES

export interface TemplatesRequest {}

export interface TemplatesResponse extends Array<TemplateInterface> {}

// PERMISSIONS

export interface PermissionsRequest {}

export interface PermissionsResponse {
  permission: boolean;
  error?: string;
}
