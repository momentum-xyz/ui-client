import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {MediaUploader, SoundInfo} from 'core/models';
import {SoundFormInterface} from 'core/interfaces';

const SoundSelectorStore = types
  .compose(
    ResetModel,
    types.model('SoundSelectorStore', {
      soundInfo: types.maybeNull(SoundInfo),
      mediaUploader: types.optional(MediaUploader, {}),
      fetchRequest: types.optional(RequestModel, {}),
      publishRequest: types.optional(RequestModel, {})
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
        self.soundInfo = SoundInfo.create({
          name: attributeResponse.name,
          hash: attributeResponse.render_hash
        });
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
        value: {render_hash, name: form.name || ''}
      });

      return self.publishRequest.isDone;
    })
  }));

export {SoundSelectorStore};
