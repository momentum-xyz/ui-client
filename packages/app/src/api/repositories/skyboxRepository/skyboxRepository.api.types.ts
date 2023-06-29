export interface GenerateSkyboxRequest {
  prompt: string;
  skybox_style_id: number;
  world_id: string;
}

export interface SkyboxGenerationStatusInterface {
  id: string;
  message: null | string;
  status: string;
  file_url: string;
  thumb_url: string;
  created_at: string;
  updated_at: string;
  error_message: null | string;
  skybox_style_id: number;
  // there are more fields, but we don't need them
}

export interface GenerateSkyboxResponse {
  success: boolean;
  data: SkyboxGenerationStatusInterface;
}

export interface FetchGeneratedSkyboxRequest {
  skyboxId: string | number;
}

export interface AIStyleItemInterface {
  id: number;
  name: string;
  ['max-char']: number;
  // there are more fields, but we don't need them
}

export interface FetchAIStylesResponse extends Array<AIStyleItemInterface> {}
