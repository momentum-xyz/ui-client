import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {flow, types} from 'mobx-state-tree';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {ObjectColorAttributeInterface} from 'api/interfaces';

const ObjectColorStore = types
  .compose(
    ResetModel,
    types.model('ObjectColorStore', {
      objectId: types.maybe(types.string),
      objectColor: types.maybe(types.string),
      fetchRequest: types.optional(RequestModel, {}),
      updateRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    async init(objectId: string): Promise<void> {
      await this.fetchObjectColor(objectId);
    },

    fetchObjectColor: flow(function* (objectId: string) {
      const response: ObjectColorAttributeInterface = yield self.fetchRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: objectId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.OBJECT_COLOR
        }
      );

      if (response) {
        self.objectColor = response.color;
      }
    }),
    updateObjectColor: flow(function* (objectId: string, colorHex: string) {
      const value: ObjectColorAttributeInterface = {color: colorHex};

      yield self.updateRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.OBJECT_COLOR,
        value
      });
    })
  }));

export {ObjectColorStore};
