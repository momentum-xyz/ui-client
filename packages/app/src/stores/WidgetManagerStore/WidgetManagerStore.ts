import {types} from 'mobx-state-tree';

import {WidgetTypeEnum, WidgetPositionEnum} from 'core/enums';

// TODO: TBD
const WidgetManagerStore = types
  .model('WidgetManagerStore', {
    leftActiveWidget: '',
    centerActiveWidget: '',
    rightActiveWidget: ''
  })
  .actions((self) => ({
    open: (widget: WidgetTypeEnum, position: WidgetPositionEnum) => {},
    close: (widget: WidgetTypeEnum) => {},
    closeAll: () => {}
  }));

export {WidgetManagerStore};
