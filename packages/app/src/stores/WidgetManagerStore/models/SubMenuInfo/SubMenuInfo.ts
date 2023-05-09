import {Instance, types} from 'mobx-state-tree';
import {PositionEnum, MenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

const SubMenuInfo = types.model('WidgetManagerStore', {
  position: types.enumeration(Object.values(PositionEnum)),
  activeKeys: types.optional(types.array(types.string), []),
  sourceItemKey: types.optional(types.string, ''),
  items: types.optional(types.array(types.frozen<MenuItemInterface<string>>()), [])
});
export interface SubMenuInfoModelInterface extends Instance<typeof SubMenuInfo> {}

export {SubMenuInfo};
