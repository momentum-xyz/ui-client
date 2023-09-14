import {types, flow, cast} from 'mobx-state-tree';
import {ObjectTypeIdEnum, RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginIdEnum} from 'api/enums';
import {api, GetSpaceInfoResponse} from 'api';
import {BasicAsset2dIdEnum} from 'core/enums';
import {
  PluginAttributesManager,
  PluginLoader,
  DynamicScriptList,
  ObjectUserAttribute,
  User
} from 'core/models';
import {getRootStore} from 'core/utils';

import {ObjectContentStore} from './models';

const {REACT_APP_LOCAL_PLUGINS = '{}'} = process.env;
const localPlugins = JSON.parse(REACT_APP_LOCAL_PLUGINS);
// It's: {[asset_2d_id: string]: {meta: {id, name, pluginId, scopeName, scriptUrl}}}
// const localPlugins = {
//   'bda25d5d-2aab-45b4-9e8a-23579514cec1': {
//     meta: {
//       id: '308fdacc-8c2d-40dc-bd5f-d1549e3e03ba',
//       name: 'plugin_video',
//       pluginId: '308fdacc-8c2d-40dc-bd5f-d1549e3e03ba',
//       scopeName: 'plugin_video',
//       scriptUrl: 'http://localhost:3001/remoteEntry.js'
//     }
//   }
// } as any;

const COMMENTS_PAGE_SIZE = 100;

const ObjectStore = types
  .compose(
    ResetModel,
    types.model('ObjectStore', {
      objectName: types.maybe(types.string),
      objectTypeId: types.maybe(types.enumeration(Object.values(ObjectTypeIdEnum))),
      asset2dId: types.maybe(types.string),
      ownerId: types.maybe(types.string),
      updatedAt: types.maybe(types.string),

      objectRequest: types.optional(RequestModel, {}),
      assetRequest: types.optional(RequestModel, {}),
      nameRequest: types.optional(RequestModel, {}),
      ownerRequest: types.optional(RequestModel, {}),

      votesAttr: types.maybeNull(ObjectUserAttribute),
      commentsAttr: types.maybeNull(ObjectUserAttribute),

      owner: types.maybe(User),

      dynamicScriptList: types.optional(DynamicScriptList, {}),
      pluginLoader: types.maybe(PluginLoader),

      objectContentStore: types.optional(ObjectContentStore, {})
    })
  )
  .actions((self) => ({
    initPluginLoader: flow(function* (asset2dId: string, objectId: string) {
      let assetData = localPlugins[asset2dId];

      console.log('initPluginLoader', asset2dId, objectId, assetData);

      if (!assetData) {
        assetData = yield self.assetRequest.send(api.assets2dRepository.get2dAsset, {
          assetId: asset2dId
        });
      } else {
        console.log('Use local PLUGIN assetData for object', objectId, ':', assetData);
      }

      if (!assetData) {
        return;
      }

      const {options, meta} = assetData;

      if (!self.dynamicScriptList.containsLoaderWithName(meta.scopeName)) {
        yield self.dynamicScriptList.addScript(meta.scopeName, meta.scriptUrl);
      }

      self.pluginLoader = PluginLoader.create({
        id: asset2dId,
        ...options,
        ...meta,
        attributesManager: PluginAttributesManager.create({
          pluginId: meta.pluginId,
          spaceId: objectId
        })
      });

      yield self.pluginLoader.loadPlugin();
    })
  }))
  .actions((self) => ({
    loadAsset2D: flow(function* (objectId: string) {
      const spaceInfo: GetSpaceInfoResponse | undefined = yield self.objectRequest.send(
        api.spaceInfoRepository.getSpaceInfo,
        {spaceId: objectId}
      );

      if (!spaceInfo) {
        return;
      }

      self.asset2dId = spaceInfo.asset_2d_id;
      self.objectTypeId = cast(spaceInfo.object_type_id);
      self.ownerId = spaceInfo.owner_id;
      // self.updatedAt = spaceInfo.updated_at;

      switch (self.asset2dId) {
        case BasicAsset2dIdEnum.CONTENT:
        case BasicAsset2dIdEnum.CUSTOMIZABLE:
        case BasicAsset2dIdEnum.CANVAS_ROOT:
        case BasicAsset2dIdEnum.CANVAS_CHILD: {
          const objectResponse = yield self.assetRequest.send(api.assets2dRepository.get2dAsset, {
            assetId: self.asset2dId
          });

          if (objectResponse?.meta.pluginId) {
            self.objectContentStore.setObject(objectResponse, objectId, spaceInfo.owner_id);
          }
          break;
        }
        default: {
          yield self.initPluginLoader(self.asset2dId, objectId);
          self.objectContentStore.assetType = 'plugin';
          break;
        }
      }

      if (!self.pluginLoader) {
        yield self.initPluginLoader(BasicAsset2dIdEnum.VIDEO, objectId);
      }
    }),
    fetchObjectName: flow(function* (objectId: string) {
      const response = yield self.nameRequest.send(
        api.objectAttributeRepository.getObjectAttribute,
        {
          objectId: objectId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.NAME
        }
      );

      if (response === undefined || !(AttributeNameEnum.NAME in response)) {
        return;
      }

      self.objectName = response[AttributeNameEnum.NAME];
    }),
    fetchObjectOwner: flow(function* () {
      if (!self.ownerId) {
        return;
      }

      const response = yield self.ownerRequest.send(api.userRepository.fetchUser, {
        userId: self.ownerId
      });

      if (response === undefined) {
        return;
      }

      self.owner = cast(response);

      return response;
    }),
    fetchComments: flow(function* (startIndex = 0) {
      if (!self.commentsAttr) {
        return;
      }

      yield self.commentsAttr.entries({
        orderDirection: 'DESC',
        // Fields of ObjectCommentInterface
        fields: ['uuid', 'created', 'content'],
        order: 'created',
        limit: COMMENTS_PAGE_SIZE,
        offset: startIndex
      });
    })
  }))
  .actions((self) => ({
    init: flow(function* (objectId: string) {
      yield self.loadAsset2D(objectId);
      yield Promise.all([self.fetchObjectOwner(), self.fetchObjectName(objectId)]);

      self.votesAttr = ObjectUserAttribute.create({
        objectId,
        attributeName: AttributeNameEnum.VOTE,
        pluginId: PluginIdEnum.CORE,
        userId: getRootStore(self).sessionStore.userId
      });
      yield self.votesAttr.load();
      yield self.votesAttr.countAllUsers();

      self.commentsAttr = ObjectUserAttribute.create({
        objectId,
        attributeName: AttributeNameEnum.COMMENTS,
        pluginId: PluginIdEnum.CORE,
        userId: getRootStore(self).sessionStore.userId
      });
      yield self.fetchComments();

      return self.asset2dId;
    })
  }));

export {ObjectStore};
