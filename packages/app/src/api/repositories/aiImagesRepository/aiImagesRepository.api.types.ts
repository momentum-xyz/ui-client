import {LeonardoModelIdEnum} from 'core/enums';

/** GENERATE IMAGES **/

export interface GenerateAIImagesRequest {
  prompt: string;
  model: LeonardoModelIdEnum;
}

export interface GenerateAIImagesResponse {
  success: boolean;
  data: {
    sdGenerationJob: {
      generationId: string;
    };
  };
}

/** FETCH GENERATED IMAGES **/

export interface FetchAIGeneratedImagesRequest {
  leonardoId: string;
}

export interface FetchAIGeneratedImagesResponse {
  success: boolean;
  data: {
    generations_by_pk: {
      id: string;
      prompt: string;
      status: string;
      createdAt: string;
      generated_images: [
        {
          id: string;
          nsfw: boolean;
          url: string;
        }
      ];
    };
  };
}
