import {PositionInterface, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {flow, types} from 'mobx-state-tree';

import {api} from 'api';
import {PluginIdEnum} from 'api/enums';
import {SpawnPointAttributeInterface} from 'api/interfaces';

const SpawnPointStore = types
  .compose(
    ResetModel,
    types.model('SpawnPointStore', {
      updateRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    // FIXME: It should be a particular object id instead of world id
    setSpawnPoint: flow(function* (
      worldId: string,
      location: PositionInterface,
      rotation: PositionInterface
    ) {
      const value: SpawnPointAttributeInterface = {
        value: {object: worldId, location, rotation}
      };

      yield self.updateRequest.send(api.objectAttributeRepository.setObjectAttribute, {
        objectId: worldId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.SPAWN_POINT,
        value
      });

      return self.updateRequest.isDone;
    })
  }));

export {SpawnPointStore};
