import {Instance, types} from 'mobx-state-tree';
import {PositionEnum, MenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {WidgetEnum} from 'core/enums';

const SubMenuInfo = types.model('WidgetManagerStore', {
  position: types.enumeration(Object.values(PositionEnum)),
  activeKeys: types.optional(types.array(types.enumeration(Object.values(WidgetEnum))), []),
  sourceItemKey: types.enumeration(Object.values(WidgetEnum)),
  items: types.optional(types.array(types.frozen<MenuItemInterface<WidgetEnum>>()), [])
});
export interface SubMenuInfoModelInterface extends Instance<typeof SubMenuInfo> {}

export {SubMenuInfo};
