export enum Actions {
  START_LOAD,
  ON_LOAD,
  ON_PLAY,
  ON_END,
  ON_PAUSE,
  ON_STOP,
  SHOW_PLAYER,
  HIDE_PLAYER,
  ON_PLAY_ERROR,
  ON_LOAD_ERROR
}

interface BaseAction {
  type: Actions;
}

interface ErrorAction extends BaseAction {
  error: Error;
}

interface LoadAction extends BaseAction {
  duration: number;
  vol: number;
}

type Action = BaseAction | ErrorAction | LoadAction;

export interface MusicPlayerState {
  loading: boolean;
  playing: boolean;
  stopped: boolean;
  error: Error | null;
  duration: number;
  ready: boolean;
  ended: boolean;
  show: boolean;
  vol: number;
}

export const initialState: MusicPlayerState = {
  loading: true,
  playing: false,
  stopped: true,
  ended: false,
  error: null,
  duration: 0,
  ready: false,
  show: false,
  vol: 0.1
};

export const reducer = (state: MusicPlayerState, action: Action) => {
  switch (action.type) {
    case Actions.START_LOAD:
      return {
        ...state,
        loading: true,
        stopped: true,
        ready: false,
        error: null,
        duration: 0
      };
    case Actions.ON_LOAD:
      return {
        ...state,
        loading: false,
        duration: (action as LoadAction).duration,
        ended: false,
        ready: true,
        vol: (action as LoadAction).vol
      };
    case Actions.ON_PLAY:
      return {
        ...state,
        playing: true,
        ended: false,
        stopped: false
      };
    case Actions.ON_STOP:
      return {
        ...state,
        stopped: true,
        playing: false
      };
    case Actions.ON_END:
      return {
        ...state,
        stopped: true,
        playing: false,
        ended: true
      };
    case Actions.ON_PAUSE:
      return {
        ...state,
        playing: false
      };
    case Actions.ON_PLAY_ERROR:
      return {
        ...state,
        playing: false,
        stopped: true,
        error: (action as ErrorAction).error
      };
    case Actions.ON_LOAD_ERROR:
      return {
        ...state,
        playing: false,
        stopped: true,
        loading: false,
        error: (action as ErrorAction).error
      };
    case Actions.SHOW_PLAYER:
      return {
        ...state,
        show: false
      };
    case Actions.HIDE_PLAYER:
      return {
        ...state,
        show: true
      };
    default:
      return state;
  }
};
