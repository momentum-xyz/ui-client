import {Instance, types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

const CommunicationLayerStore = types.compose(
  ResetModel,
  types.model('CommunicationLayerStore', {})
);

export interface CommunicationLayerStoreInterface
  extends Instance<typeof CommunicationLayerStore> {}

export {CommunicationLayerStore};
