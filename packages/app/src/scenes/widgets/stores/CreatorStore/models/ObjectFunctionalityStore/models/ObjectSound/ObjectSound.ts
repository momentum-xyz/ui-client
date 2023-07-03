import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {Event3dEmitter, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {SoundFormInterface} from 'core/interfaces';
import {MediaUploader, MusicPlayer, TrackInfoModelInterface} from 'core/models';

const DEFAULT_VOLUME_PERCENT = 25;
const DEFAULT_DISTANCE = 100;

const ObjectSound = types
  .compose(
    ResetModel,
    types.model('ObjectSound', {
      objectId: '',
      mediaUploader: types.optional(MediaUploader, {}),
      musicPlayer: types.optional(MusicPlayer, {hasDistance: true}),
      fetchRequest: types.optional(RequestModel, {}),
      publishRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    setObjectId(objectId: string): void {
      self.objectId = objectId;
    }
  }))
  .actions((self) => ({
    updateAttribute: flow(function* (tracks: TrackInfoModelInterface[]) {
      yield self.publishRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: self.objectId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SPATIAL_AUDIO,
        value: {
          tracks,
          volume: self.musicPlayer.volume,
          distance: self.musicPlayer.distance
        }
      });
    })
  }))
  .actions((self) => ({
    fetchSpacialSound: flow(function* () {
      const attributeResponse = yield self.fetchRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: self.objectId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.SPATIAL_AUDIO
        }
      );

      if (attributeResponse) {
        self.musicPlayer.refreshTracks(cast(attributeResponse.tracks || []));
        self.musicPlayer.setVolume(attributeResponse.volume || DEFAULT_VOLUME_PERCENT);
        self.musicPlayer.setDistance(attributeResponse.distance || DEFAULT_DISTANCE);
      }
    }),
    publishSpacialSound: flow(function* (form: SoundFormInterface) {
      const render_hash = yield self.mediaUploader.uploadAudio(form.trackFile);
      if (!render_hash) {
        return false;
      }

      yield self.updateAttribute([
        ...self.musicPlayer.tracks.filter((i) => i.render_hash !== render_hash),
        {render_hash, name: form.name || ''}
      ]);

      return self.publishRequest.isDone;
    }),
    deleteSpacialSound: flow(function* (render_hash: string) {
      yield self.updateAttribute([
        ...self.musicPlayer.tracks.filter((s) => s.render_hash !== render_hash)
      ]);
      return self.publishRequest.isDone;
    }),
    updateVolume: flow(function* (volumePercent: number) {
      self.musicPlayer.setVolume(volumePercent);
      yield self.updateAttribute(self.musicPlayer.tracks);
    }),
    updateDistance: flow(function* (distancePercent: number) {
      self.musicPlayer.setDistanceByPercent(distancePercent);
      yield self.updateAttribute(self.musicPlayer.tracks);
    })
  }))
  .actions((self) => ({
    soundChanged(
      objectId: string,
      tracks: TrackInfoModelInterface[],
      volume: number,
      distance: number
    ): void {
      if (objectId === self.objectId) {
        self.musicPlayer.refreshTracks(tracks);
        self.musicPlayer.setDistance(distance);
        self.musicPlayer.setVolume(volume);
      }
    },
    subscribe() {
      Event3dEmitter.on('SpatialSoundChanged', this.soundChanged);
    },
    unsubscribe() {
      Event3dEmitter.off('SpatialSoundChanged', this.soundChanged);
    }
  }))
  .actions((self) => ({
    async init(objectId: string) {
      self.setObjectId(objectId);
      await self.fetchSpacialSound();
    }
  }))
  .views((self) => ({
    get isAvailable(): boolean {
      return self.musicPlayer.tracks.length > 0;
    },
    get hasActiveTrack(): boolean {
      return !!self.musicPlayer.activeTrack;
    },
    get isUpdating(): boolean {
      return self.publishRequest.isPending || self.mediaUploader.isPending;
    }
  }));

export {ObjectSound};
