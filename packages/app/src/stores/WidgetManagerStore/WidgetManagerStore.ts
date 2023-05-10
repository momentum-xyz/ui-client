import {cast, types} from 'mobx-state-tree';
import {PositionEnum} from '@momentum-xyz/ui-kit-storybook';
import {MenuItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {WidgetEnum} from 'core/enums';

import {SubMenuInfo, WidgetInfo, WidgetInfoDataInterface} from './models';

// TODO: Not final implementation. It depends on flow/design
const WidgetManagerStore = types
  .model('WidgetManagerStore', {
    leftActiveWidget: types.maybeNull(WidgetInfo),
    rightActiveWidget: types.maybeNull(WidgetInfo),

    subMenuInfo: types.maybeNull(SubMenuInfo)
  })
  .actions((self) => ({
    toggle(type: WidgetEnum, position: PositionEnum): void {
      switch (position) {
        case PositionEnum.LEFT:
          self.leftActiveWidget?.type !== type ? this.open(type, position) : this.close(type);
          break;
        case PositionEnum.RIGHT:
          self.rightActiveWidget?.type !== type ? this.open(type, position) : this.close(type);
          break;
      }
    },
    open(type: WidgetEnum, position: PositionEnum, data?: WidgetInfoDataInterface): void {
      switch (position) {
        case PositionEnum.LEFT:
          self.leftActiveWidget = cast({type, data});
          break;
        case PositionEnum.RIGHT:
          self.rightActiveWidget = cast({type, data});
          break;
      }
    },
    close(type: WidgetEnum): void {
      if (self.leftActiveWidget?.type === type) {
        self.leftActiveWidget = null;
      } else if (self.rightActiveWidget?.type === type) {
        self.rightActiveWidget = null;
      }
    },
    closeAll(): void {
      self.leftActiveWidget = null;
      self.rightActiveWidget = null;
    },
    openSubMenu(
      key: WidgetEnum,
      items: MenuItemInterface<WidgetEnum>[],
      position: PositionEnum
    ): void {
      self.subMenuInfo = cast({
        position,
        sourceItemKey: key,
        items,
        activeKeys: []
      });
    },
    closeSubMenu(): void {
      self.subMenuInfo = null;
    },
    setActiveSubMenuKeys(keys: WidgetEnum[]): void {
      self.subMenuInfo?.activeKeys.replace(keys);
    }
  }))
  .views((self) => ({
    get activeWidgetList(): Array<WidgetEnum> {
      const widgets: WidgetEnum[] = [];
      if (self.leftActiveWidget) {
        widgets.push(self.leftActiveWidget.type);
      }
      if (self.rightActiveWidget) {
        widgets.push(self.rightActiveWidget.type);
      }

      return widgets;
    },
    get isLeftWidgetShown(): boolean {
      return !!self.leftActiveWidget;
    },
    get isRightWidgetShown(): boolean {
      return !!self.rightActiveWidget;
    }
  }));

export {WidgetManagerStore};
