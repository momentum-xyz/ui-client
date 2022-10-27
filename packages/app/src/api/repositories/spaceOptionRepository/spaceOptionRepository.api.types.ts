import {OptionsInterface} from 'api/interfaces';

export interface SpaceOptionRequest {
  worldId: string;
  spaceId: string;
}

// GET SPACE OPTIONS
export interface GetSpaceOptionsRequest extends SpaceOptionRequest {}

export interface GetSpaceOptionsResponse extends OptionsInterface {}

// GET SPACE SUBOPTION
export interface GetSpaceSubOptionRequest extends SpaceOptionRequest {
  sub_option_key: string;
}
