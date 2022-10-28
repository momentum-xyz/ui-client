import {OptionsInterface} from 'api/interfaces';

export interface SpaceRequest {
  worldId: string;
  spaceId: string;
}

// GET SPACE OPTIONS
export interface GetSpaceOptionsRequest extends SpaceRequest {}

export interface GetSpaceOptionsResponse extends OptionsInterface {}

// GET SPACE SUBOPTION
export interface GetSpaceSubOptionRequest extends SpaceRequest {
  sub_option_key: string;
}
