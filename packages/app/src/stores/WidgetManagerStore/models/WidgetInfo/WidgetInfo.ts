import {Instance, types} from 'mobx-state-tree';

import {WidgetEnum} from 'core/enums';

export interface WidgetInfoDataInterface {
  id: string | number;
}

const WidgetInfo = types.model('WidgetManagerStore', {
  type: types.enumeration(Object.values(WidgetEnum)),
  data: types.maybeNull(types.frozen<WidgetInfoDataInterface>())
});
export interface WidgetInfoModelInterface extends Instance<typeof WidgetInfo> {}

export {WidgetInfo};
