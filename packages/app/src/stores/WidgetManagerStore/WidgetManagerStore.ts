import {cast, types} from 'mobx-state-tree';
import {MenuItemPositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {WidgetTypeEnum} from 'core/enums';

import {WidgetInfo} from './models';

const WidgetManagerStore = types
  .model('WidgetManagerStore', {
    leftActiveWidget: types.maybeNull(WidgetInfo),
    centerActiveWidget: types.maybeNull(WidgetInfo),
    rightActiveWidget: types.maybeNull(WidgetInfo)
  })
  .actions((self) => ({
    toggle(type: WidgetTypeEnum, position: MenuItemPositionEnum) {
      if (type && this.getActiveType() !== type) {
        this.open(type, position);
      } else {
        this.close(type);
      }
    },
    open(type: WidgetTypeEnum, position: MenuItemPositionEnum) {
      switch (position) {
        case MenuItemPositionEnum.LEFT:
          self.leftActiveWidget = cast({type});
          self.rightActiveWidget = null;
          self.centerActiveWidget = null;
          break;
        case MenuItemPositionEnum.CENTER:
          self.centerActiveWidget = cast({type});
          self.rightActiveWidget = null;
          self.leftActiveWidget = null;
          break;
        case MenuItemPositionEnum.RIGHT:
          self.rightActiveWidget = cast({type});
          self.centerActiveWidget = null;
          self.leftActiveWidget = null;
          break;
      }
    },
    close(type: WidgetTypeEnum) {
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
    getActiveType(): WidgetTypeEnum | undefined {
      return (
        self.leftActiveWidget?.type || self.centerActiveWidget?.type || self.rightActiveWidget?.type
      );
    }
  }))
  .views((self) => ({
    get activeType(): WidgetTypeEnum | undefined {
      return (
        self.leftActiveWidget?.type || self.centerActiveWidget?.type || self.rightActiveWidget?.type
      );
    }
  }));

export {WidgetManagerStore};
