import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {storage} from 'shared/services';
import {StorageKeyEnum} from 'core/enums';

const DEFAULT_VOLUME_PERCENT = 30;

const MusicStore = types
  .compose(
    ResetModel,
    types.model('MusicStore', {
      isPlaying: false,
      volume: DEFAULT_VOLUME_PERCENT
    })
  )
  .actions((self) => ({
    init(): void {
      const stored = storage.get<string>(StorageKeyEnum.VolumeLevel);
      self.volume = stored ? Number(stored) : DEFAULT_VOLUME_PERCENT;
    },
    setVolume(volumePercent: number): void {
      storage.setString(StorageKeyEnum.VolumeLevel, volumePercent.toString());
      self.volume = volumePercent;
    }
  }));

export {MusicStore};
