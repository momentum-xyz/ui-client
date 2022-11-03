import {OptionsInterface} from 'api/interfaces';

export interface SpaceSubOptionResponse {
  [sub_attribute_key: string]: unknown;
}

// GET SPACE OPTIONS
export interface GetSpaceOptionsRequest {
  spaceId: string;
}

export interface GetSpaceOptionsResponse extends OptionsInterface {}

// GET SPACE SUBOPTION
export interface GetSpaceSubOptionRequest {
  spaceId: string;
  sub_option_key: string;
}

// SET SPACE SUBOPTION
export interface SetSpaceSubOptionRequest extends GetSpaceSubOptionRequest {
  value: unknown;
}
