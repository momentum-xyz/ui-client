import {useMemo, useRef, useState} from 'react';

import {IconNameType} from '../../types';
import {Hexagon} from '../../atoms';
import {useResize} from '../../hooks';
import {PositionEnum} from '../../enums';

import * as styled from './Menu.styled';

const MENU_ITEM_WIDTH = 48;
const BLANK_MARGIN = 9.6;

export interface MenuItemInterface<T> {
  key: T;
  imageSrc?: string;
  iconName?: IconNameType;
  tooltip?: string;
  position: PositionEnum;
  subMenuItems?: MenuItemInterface<T>[];
  onClick?: (key: T, position: PositionEnum) => void;
}

export interface MenuPropsInterface<T> {
  activeKeys?: T[];
  items?: MenuItemInterface<T>[];
}

const Menu = <T,>({activeKeys = [], items = []}: MenuPropsInterface<T>) => {
  const ref = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth - 20);
  useResize(ref, () => setWindowWidth(window.innerWidth - 20));

  const leftItems: MenuItemInterface<T>[] = items.filter((i) => i.position === PositionEnum.LEFT);

  const rightItems: MenuItemInterface<T>[] = items.filter((i) => i.position === PositionEnum.RIGHT);

  const centerItems: MenuItemInterface<T>[] = items.filter(
    (i) => i.position === PositionEnum.CENTER
  );

  const calculateSubMenuLeftOffset = (
    subMenu: MenuItemInterface<T>[] | undefined,
    leftActions: MenuItemInterface<T>[],
    leftBlankCount: number,
    activeCenterActionIdx: number,
    sidePadding: number
  ): number => {
    if (!subMenu?.length) {
      return 0;
    }
    const offsetsToAdd = leftActions.length + leftBlankCount + activeCenterActionIdx;
    const offsetsToSubtract = Math.floor(subMenu?.length / 2);
    const offsetCnt = offsetsToAdd - offsetsToSubtract;
    return offsetCnt * MENU_ITEM_WIDTH + sidePadding / 2 + MENU_ITEM_WIDTH / 2;
  };

  const [sidePadding, leftBlankCount, rightBlankCount] = useMemo(() => {
    const totalPossibleHexagons = Math.floor(windowWidth / MENU_ITEM_WIDTH);
    const tmp_sidePadding = windowWidth - totalPossibleHexagons * MENU_ITEM_WIDTH;

    const nonCentralHexagons = totalPossibleHexagons - centerItems.length;

    let tmp_leftBlankCount = nonCentralHexagons / 2 - leftItems.length;
    let tmp_rightBlankCount = nonCentralHexagons / 2 - rightItems.length;

    if (tmp_leftBlankCount <= 0) {
      tmp_leftBlankCount = 1;
      tmp_rightBlankCount = tmp_rightBlankCount > 1 ? tmp_rightBlankCount - 1 : tmp_rightBlankCount;
    }

    if (tmp_rightBlankCount <= 0) {
      tmp_rightBlankCount = 1;
      tmp_leftBlankCount = tmp_leftBlankCount > 1 ? tmp_leftBlankCount - 1 : tmp_leftBlankCount;
    }

    if (tmp_leftBlankCount % 1 !== 0) {
      tmp_leftBlankCount = Math.floor(tmp_leftBlankCount);
      tmp_rightBlankCount = Math.ceil(tmp_rightBlankCount);
    }

    return [tmp_sidePadding, tmp_leftBlankCount, tmp_rightBlankCount];
  }, [leftItems, centerItems, rightItems, windowWidth]);

  const activeCenterActionIdx = centerItems.findIndex(({key}) => activeKeys.includes(key));
  const subMenu: MenuItemInterface<T>[] | undefined = activeCenterActionIdx
    ? centerItems[activeCenterActionIdx]?.subMenuItems
    : undefined;
  const subMenuLeftOffset = calculateSubMenuLeftOffset(
    subMenu,
    leftItems,
    leftBlankCount,
    activeCenterActionIdx,
    sidePadding
  );

  const visualizeSection = (items: MenuItemInterface<T>[]) => (
    <>
      {items.map((action, index) => (
        <Hexagon
          key={index}
          type="primary"
          iconName={action.iconName}
          imageSrc={action.imageSrc}
          isActive={activeKeys.includes(action.key)}
          onClick={() => {
            action.onClick?.(action.key, action.position);
          }}
        />
      ))}
    </>
  );

  return (
    <styled.Container
      ref={ref}
      data-testid="Menu-test"
      style={{padding: `0px ${sidePadding ? sidePadding / 2 : 0}px`}}
    >
      {visualizeSection(leftItems)}

      {new Array(leftBlankCount).fill(null).map((_, i) => (
        <Hexagon key={`blank_${i}`} type="blank" margin={BLANK_MARGIN} />
      ))}

      {visualizeSection(centerItems)}

      {new Array(rightBlankCount).fill(null).map((_, i) => (
        <Hexagon key={`blank_${i + (leftBlankCount || 0)}`} type="blank" margin={BLANK_MARGIN} />
      ))}

      {visualizeSection(rightItems)}

      {subMenu?.length && (
        <styled.SubMenuItemsContainer style={{left: `${subMenuLeftOffset}px`}}>
          {visualizeSection(subMenu)}
        </styled.SubMenuItemsContainer>
      )}
    </styled.Container>
  );
};

export default Menu;
