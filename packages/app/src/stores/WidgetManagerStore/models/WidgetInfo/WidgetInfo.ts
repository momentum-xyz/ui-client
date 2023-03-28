import {Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {WidgetTypeEnum} from 'core/enums';

export interface WidgetInfoDataInterface {
  id: string | number;
}

const WidgetInfo = types.compose(
  ResetModel,
  types.model('WidgetManagerStore', {
    type: types.enumeration(Object.values(WidgetTypeEnum)),
    data: types.maybeNull(types.frozen<WidgetInfoDataInterface>())
  })
);

export type WidgetInfoModelType = Instance<typeof WidgetInfo>;

export {WidgetInfo};
