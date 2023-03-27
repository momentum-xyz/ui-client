import {types} from 'mobx-state-tree';

import {WidgetEnum, WidgetPositionEnum} from 'core/enums';

// TODO: TBD
const WidgetManagerStore = types
  .model('WidgetManagerStore', {
    leftActiveWidget: '',
    centerActiveWidget: '',
    rightActiveWidget: ''
  })
  .actions((self) => ({
    open: (widget: WidgetEnum, position: WidgetPositionEnum) => {},
    close: (widget: WidgetEnum) => {},
    closeAll: () => {}
  }));

export {WidgetManagerStore};
