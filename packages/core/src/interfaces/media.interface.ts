import {MediaEnum} from '../enums';

export interface MediaInterface {
  mediaType: MediaEnum;
  file?: File;
}
