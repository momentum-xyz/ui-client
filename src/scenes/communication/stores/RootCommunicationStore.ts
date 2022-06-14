import {Instance, types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {CommunicationLayerStore} from './CommunicationLayerStore';

const RootCommunicationStore = types.compose(
  ResetModel,
  types.model('RootCommunicationStore', {
    communicationLayerStore: types.optional(CommunicationLayerStore, {})
  })
);

export interface RootCommunicationStoreInterface extends Instance<typeof RootCommunicationStore> {}

export {RootCommunicationStore};
