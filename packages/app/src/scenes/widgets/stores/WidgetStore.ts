import {Instance, types} from 'mobx-state-tree';

import {ScreenShareStore} from './ScreenShareStore';

const WidgetStore = types.model('WidgetStore', {
  screenShareStore: types.optional(ScreenShareStore, {})
});
export type WidgetStoreType = Instance<typeof WidgetStore>;

export {WidgetStore};
