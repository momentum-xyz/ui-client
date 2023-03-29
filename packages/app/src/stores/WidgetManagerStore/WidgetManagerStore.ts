import {cast, types} from 'mobx-state-tree';
import {PositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {WidgetEnum} from 'core/enums';

import {WidgetInfo, WidgetInfoDataInterface} from './models';

// TODO: Not final implementation. It depends on flow/design
const WidgetManagerStore = types
  .model('WidgetManagerStore', {
    leftActiveWidget: types.maybeNull(WidgetInfo),
    centerActiveWidget: types.maybeNull(WidgetInfo),
    rightActiveWidget: types.maybeNull(WidgetInfo)
  })
  .actions((self) => ({
    toggle(type: WidgetEnum, position: PositionEnum, data?: WidgetInfoDataInterface) {
      if (type && this.getActiveType() !== type) {
        this.open(type, position);
      } else {
        this.close(type);
      }
    },
    open(type: WidgetEnum, position: PositionEnum, data?: WidgetInfoDataInterface) {
      switch (position) {
        case PositionEnum.LEFT:
          self.leftActiveWidget = cast({type, data});
          self.rightActiveWidget = null;
          self.centerActiveWidget = null;
          break;
        case PositionEnum.CENTER:
          self.centerActiveWidget = cast({type, data});
          self.rightActiveWidget = null;
          self.leftActiveWidget = null;
          break;
        case PositionEnum.RIGHT:
          self.rightActiveWidget = cast({type, data});
          self.centerActiveWidget = null;
          self.leftActiveWidget = null;
          break;
      }
    },
    close(type: WidgetEnum) {
      if (self.leftActiveWidget?.type === type) {
        self.leftActiveWidget = null;
      } else if (self.rightActiveWidget?.type === type) {
        self.rightActiveWidget = null;
      } else if (self.centerActiveWidget?.type === type) {
        self.centerActiveWidget = null;
      }
    },
    closeAll: () => {
      self.leftActiveWidget = null;
      self.rightActiveWidget = null;
      self.centerActiveWidget = null;
    },
    getActiveType(): WidgetEnum | undefined {
      return (
        self.leftActiveWidget?.type || self.centerActiveWidget?.type || self.rightActiveWidget?.type
      );
    }
  }))
  .views((self) => ({
    get activeType(): WidgetEnum | undefined {
      return (
        self.leftActiveWidget?.type || self.centerActiveWidget?.type || self.rightActiveWidget?.type
      );
    }
  }));

export {WidgetManagerStore};
