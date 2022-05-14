import React from 'react';
import {HowlOptions, Howl} from 'howler';

import {MusicPlayerState} from './MusicPlayerStateReducer';

export interface MusicPlayerContextInterface extends MusicPlayerState {
  player: Howl | null;
  load: (args: HowlOptions) => void;
  handleMusicPlayer: (args: boolean) => void;
}

export interface MusicPlayerPositionContextInterface {
  position: number;
  setPosition: React.Dispatch<number>;
}
