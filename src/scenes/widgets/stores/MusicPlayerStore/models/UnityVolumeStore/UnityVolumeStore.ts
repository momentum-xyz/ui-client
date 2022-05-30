import {types} from 'mobx-state-tree';
import {ChangeEvent} from 'react';

import {RequestModel} from 'core/models';
import UnityService from 'context/Unity/UnityService';

const UnityVolume = types
  .model('UnityVolume', {
    request: types.optional(RequestModel, {}),
    volume: types.optional(types.number, 0.2)
  })
  .actions((self) => ({
    setVolume(volume: number) {
      self.volume = volume;
    },
    handleMuteUnity(unityMuted: boolean) {
      if (!unityMuted) {
        UnityService.toggleAllSound();
        UnityService.setSoundEffectVolume('0');
        self.volume = 0;
      }
    }
  }))
  .actions((self) => ({
    handleUnmuteUnity(unityMuted: boolean) {
      if (self.volume === 1) {
        return;
      }
      const newVolume = Math.min((unityMuted ? 0 : self.volume) + 0.1, 1.0);
      self.setVolume(newVolume);
      UnityService.setSoundEffectVolume(newVolume.toString());
      if (unityMuted) {
        UnityService.toggleAllSound();
      }
    },
    handleChangeVolume(slider: ChangeEvent<HTMLInputElement>, unityMuted: boolean) {
      const volValue = parseFloat(slider.target.value);
      if (!unityMuted && volValue === 0) {
        UnityService.toggleAllSound();
      }
      if (unityMuted && volValue > 0) {
        UnityService.toggleAllSound();
      }
      self.setVolume(volValue);
      UnityService.setSoundEffectVolume(volValue.toString());
    }
  }));
export {UnityVolume};
