import {types} from 'mobx-state-tree';
import ReactHowler from 'react-howler';

import {DialogModel, ResetModel} from 'core/models';

const MusicPlayerStore = types.compose(
  ResetModel,
  types
    .model('MusicPlayerStore', {
      musicPlayerWidget: types.optional(DialogModel, {}),
      playing: types.optional(types.boolean, false),
      loaded: types.optional(types.boolean, false),
      loop: types.optional(types.boolean, false),
      mute: types.optional(types.boolean, false),
      volume: types.optional(types.number, 0.9),
      duration: types.optional(types.number, 0),
      seek: types.optional(types.number, 0.0),
      rate: types.optional(types.number, 1),
      isSeeking: types.optional(types.boolean, false),
      html5: types.optional(types.boolean, true)
    })
    .volatile<{player: ReactHowler | null}>(() => ({
      player: null
    }))
    .actions((self) => ({
      setPlayer(ref: ReactHowler | null) {
        self.player = ref;
      },
      handleToggle() {
        console.info('toggle');

        console.info(self.playing);

        self.playing = !self.playing;
        console.info(self.playing);
      },
      handleOnLoad() {
        console.info('onLoad');
        if (!self.player) {
          return;
        }
        self.loaded = true;
        self.duration = self.player.duration();
        console.info(self.duration);
      },
      handleOnPlay() {
        console.info('onPlay');

        self.playing = true;
      }
    }))
    .actions((self) => ({
      init() {
        console.info('init');
        self.handleToggle = self.handleToggle.bind(self.player);
        self.handleOnLoad = self.handleOnLoad.bind(self.player);
        self.handleOnPlay = self.handleOnPlay.bind(self.player);
      }
    }))
);

export {MusicPlayerStore};
