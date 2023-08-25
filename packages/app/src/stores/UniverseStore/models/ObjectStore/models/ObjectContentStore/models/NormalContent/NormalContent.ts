import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginIdEnum} from 'api/enums';
import {ObjectInterface} from 'api';
import {ObjectAttribute} from 'core/models';

const NormalContent = types
  .compose(
    ResetModel,
    types.model('NormalContent', {
      content: types.maybe(types.frozen<ObjectInterface>()),
      image: types.maybe(ObjectAttribute),
      text: types.maybe(ObjectAttribute),

      request: types.optional(RequestModel, {}),
      imageUploadRequest: types.optional(RequestModel, {}),
      updateContentRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    initContent: flow(function* (objectId: string) {
      self.image = ObjectAttribute.create({
        objectId,
        pluginId: PluginIdEnum.IMAGE
      });
      self.text = ObjectAttribute.create({
        objectId,
        pluginId: PluginIdEnum.TEXT
      });

      yield self.image.load();
      yield self.text.load();
    })
  }))

  .views((self) => ({
    get isPending(): boolean {
      return self.image?.isPending || self.text?.isPending || false;
    }
  }));

export {NormalContent};
