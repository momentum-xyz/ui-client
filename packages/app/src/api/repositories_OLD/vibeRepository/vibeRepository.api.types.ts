export interface VibeToggleRequest {
  vibeAction: '+1' | '-1';
  spaceId: string;
}

export interface VibeToggleResponse {}

export interface VibeCountRequest {
  spaceId: string;
}

export interface VibeCheckRequest {
  spaceId: string;
}

export interface VibeCheckResponse {}
export interface VibeCountResponse {
  count: number;
}
