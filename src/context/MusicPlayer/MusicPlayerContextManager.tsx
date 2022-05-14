import React from 'react';

import {
  MusicPlayerContextInterface,
  MusicPlayerPositionContextInterface
} from './MusicPlayerContextType';

export const MusicPlayerContext = React.createContext<MusicPlayerContextInterface>({
  duration: 0,
  ended: false,
  error: null,
  handleMusicPlayer: () => {},
  load: () => {},
  loading: false,
  player: null,
  playing: false,
  ready: false,
  show: false,
  stopped: false,
  vol: 0
});

export const MusicPlayerPositionContext = React.createContext<MusicPlayerPositionContextInterface>({
  position: 0,
  setPosition: () => {}
});
