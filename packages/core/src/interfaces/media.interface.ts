import {MediaEnum} from '../enums';

export interface MediaInterface {
  mediaType: MediaEnum;
  file?: File;
}

export interface MediaFileInterface {
  name: string;
  hash: string;
  url: string;
}
