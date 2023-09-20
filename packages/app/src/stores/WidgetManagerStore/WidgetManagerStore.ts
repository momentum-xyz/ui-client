import {cast, types} from 'mobx-state-tree';
import {PositionEnum, MenuItemInterface} from '@momentum-xyz/ui-kit';

import {WidgetEnum} from 'core/enums';

import {SubMenuInfo, WidgetInfo, WidgetInfoDataInterface} from './models';

const WidgetManagerStore = types
  .model('WidgetManagerStore', {
    leftActiveWidget: types.maybeNull(WidgetInfo),
    centerActiveWidget: types.maybeNull(WidgetInfo),
    rightActiveWidget: types.maybeNull(WidgetInfo),

    subMenuInfo: types.maybeNull(SubMenuInfo)
  })
  .actions((self) => ({
    toggle(type: WidgetEnum, position: PositionEnum, data?: WidgetInfoDataInterface): void {
      switch (position) {
        case PositionEnum.LEFT:
          self.leftActiveWidget?.type !== type ? this.open(type, position, data) : this.close(type);
          break;
        case PositionEnum.RIGHT:
          self.rightActiveWidget?.type !== type
            ? this.open(type, position, data)
            : this.close(type);
          break;
        case PositionEnum.CENTER:
          self.centerActiveWidget?.type !== type
            ? this.open(type, position, data)
            : this.close(type);
          break;
      }
    },
    open(type: WidgetEnum, position: PositionEnum, data?: WidgetInfoDataInterface): void {
      switch (position) {
        case PositionEnum.LEFT:
          self.centerActiveWidget = null;
          self.leftActiveWidget = cast({type, data});
          break;
        case PositionEnum.RIGHT:
          self.centerActiveWidget = null;
          self.rightActiveWidget = cast({type, data});
          break;
        case PositionEnum.CENTER:
          self.leftActiveWidget = null;
          self.rightActiveWidget = null;
          self.centerActiveWidget = cast({type, data});
          break;
      }
    },
    close(type: WidgetEnum): void {
      if (self.leftActiveWidget?.type === type) {
        self.leftActiveWidget = null;
      } else if (self.rightActiveWidget?.type === type) {
        self.rightActiveWidget = null;
      } else if (self.centerActiveWidget?.type === type) {
        self.centerActiveWidget = null;
      }
    },
    closeAll(): void {
      self.leftActiveWidget = null;
      self.rightActiveWidget = null;
      self.centerActiveWidget = null;
    },
    openSubMenu(
      key: WidgetEnum,
      items: MenuItemInterface<WidgetEnum>[],
      position: PositionEnum,
      activeKeys: WidgetEnum[] = []
    ): void {
      self.subMenuInfo = cast({
        position,
        sourceItemKey: key,
        items,
        activeKeys
      });
    },
    setSubMenuActiveKeys(keys: WidgetEnum[]): void {
      self.subMenuInfo?.activeKeys.replace(keys);
    },
    closeSubMenu(): void {
      self.subMenuInfo = null;
    },
    setActiveSubMenuKeys(keys: WidgetEnum[]): void {
      self.subMenuInfo?.activeKeys.replace(keys);
    }
  }))
  .views((self) => ({
    get activeWidgetList(): Array<{widget: WidgetEnum; id: string | number | null | undefined}> {
      const widgets: {widget: WidgetEnum; id: string | number | null | undefined}[] = [];
      if (self.leftActiveWidget) {
        widgets.push({widget: self.leftActiveWidget.type, id: self.leftActiveWidget.data?.id});
      }
      if (self.rightActiveWidget) {
        widgets.push({widget: self.rightActiveWidget.type, id: self.rightActiveWidget.data?.id});
      }
      if (self.centerActiveWidget) {
        widgets.push({widget: self.centerActiveWidget.type, id: self.centerActiveWidget.data?.id});
      }

      return widgets;
    },
    get isLeftWidgetShown(): boolean {
      return !!self.leftActiveWidget;
    },
    get isRightWidgetShown(): boolean {
      return !!self.rightActiveWidget;
    },
    get isCenterWidgetShown(): boolean {
      return !!self.centerActiveWidget;
    }
  }));

export {WidgetManagerStore};
