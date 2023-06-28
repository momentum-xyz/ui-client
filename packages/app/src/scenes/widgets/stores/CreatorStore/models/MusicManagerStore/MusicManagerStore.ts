import {cast, flow, types} from 'mobx-state-tree';
import {MediaFileInterface, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {getTrackAbsoluteUrl} from 'core/utils';
import {SoundFormInterface} from 'core/interfaces';
import {MediaUploader, SoundInfo} from 'core/models';

const MusicManagerStore = types
  .compose(
    ResetModel,
    types.model('MusicManagerStore', {
      soundInfos: types.optional(types.array(SoundInfo), []),
      mediaUploader: types.optional(MediaUploader, {}),
      fetchRequest: types.optional(RequestModel, {}),
      publishRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchSound: flow(function* (worldId: string) {
      const attributeResponse = yield self.fetchRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: worldId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.SOUNDTRACK
        }
      );

      if (attributeResponse) {
        self.soundInfos = cast(attributeResponse.tracks || []);
      }
    }),
    publishSound: flow(function* (form: SoundFormInterface, worldId: string) {
      const render_hash = yield self.mediaUploader.uploadAudio(form.trackFile);
      if (!render_hash) {
        return false;
      }

      yield self.publishRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SOUNDTRACK,
        value: {
          tracks: [
            ...self.soundInfos.filter((i) => i.render_hash !== render_hash),
            {render_hash, name: form.name || ''}
          ]
        }
      });

      return self.publishRequest.isDone;
    }),
    deleteSound: flow(function* (render_hash: string, worldId: string) {
      yield self.publishRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SOUNDTRACK,
        value: {tracks: [...self.soundInfos.filter((s) => s.render_hash !== render_hash)]}
      });

      return self.publishRequest.isDone;
    })
  }))
  .views((self) => ({
    get isUpdating(): boolean {
      return self.publishRequest.isPending || self.mediaUploader.isPending;
    },
    get soundList(): MediaFileInterface[] {
      return self.soundInfos.map((item) => ({
        name: item.name,
        hash: item.render_hash,
        url: getTrackAbsoluteUrl(item.render_hash) || ''
      }));
    }
  }));

export {MusicManagerStore};
