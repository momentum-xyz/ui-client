import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {getRootStore} from 'core/utils';
import {SoundFormInterface} from 'core/interfaces';
import {MediaUploader, TrackInfoModelInterface} from 'core/models';

const MusicManagerStore = types
  .compose(
    ResetModel,
    types.model('MusicManagerStore', {
      mediaUploader: types.optional(MediaUploader, {}),
      publishRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    publishSound: flow(function* (form: SoundFormInterface, worldId: string) {
      const render_hash = yield self.mediaUploader.uploadAudio(form.trackFile);
      if (!render_hash) {
        return false;
      }

      const tracks: TrackInfoModelInterface[] = getRootStore(self).musicStore.tracks;

      yield self.publishRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SOUNDTRACK,
        value: {
          tracks: [
            ...tracks.filter((i) => i.render_hash !== render_hash),
            {render_hash, name: form.name || ''}
          ]
        }
      });

      return self.publishRequest.isDone;
    }),
    deleteSound: flow(function* (render_hash: string, worldId: string) {
      const tracks: TrackInfoModelInterface[] = getRootStore(self).musicStore.tracks;

      yield self.publishRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SOUNDTRACK,
        value: {tracks: [...tracks.filter((s) => s.render_hash !== render_hash)]}
      });

      return self.publishRequest.isDone;
    })
  }))
  .views((self) => ({
    get isUpdating(): boolean {
      return self.publishRequest.isPending || self.mediaUploader.isPending;
    }
  }));

export {MusicManagerStore};
