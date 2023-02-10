/** COMMON **/

import {UserInterface} from 'api';

/** Profile **/

export interface ProfileRequest {
  userId: string;
}

export interface ProfileResponse extends UserInterface {}
