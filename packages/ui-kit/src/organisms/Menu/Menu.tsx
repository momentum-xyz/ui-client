import {useMemo, useRef, useState} from 'react';

import {IconNameType} from '../../types';
import {Hexagon, HexagonIndicatorType} from '../../atoms';
import {useResize} from '../../hooks';
import {PositionEnum} from '../../enums';

import * as styled from './Menu.styled';

const MENU_ITEM_WIDTH = 48;
const BLANK_MARGIN = 10;

export interface MenuItemInterface<T> {
  key: T;
  imageSrc?: string | null;
  iconName?: IconNameType | null;
  iconIndicator?: HexagonIndicatorType;
  tooltip?: string;
  position: PositionEnum;
  viewPosition?: PositionEnum;
  isDisabled?: boolean;
  onClick?: (key: T, position: PositionEnum) => void;
}

export interface MenuPropsInterface<T> {
  activeKeys?: T[];
  items?: MenuItemInterface<T>[];
  subMenuItems?: MenuItemInterface<T>[];
  subMenuSource?: T;
}

const calculateSubMenuLeftOffset = <T,>(
  subMenu: MenuItemInterface<T>[] | undefined,
  leftActions: MenuItemInterface<T>[],
  centerItems: MenuItemInterface<T>[],
  rightActions: MenuItemInterface<T>[],
  leftBlankCount: number,
  rightBlankCount: number,
  subMenuSourcePosition: PositionEnum | null,
  subMenuSourceIdx: number | null,
  sidePadding: number,
  windowWidth: number
): number => {
  if (!subMenu?.length || !subMenuSourcePosition || subMenuSourceIdx === null) {
    return 0;
  }
  const offsetsToAddFromPreviousSections =
    subMenuSourcePosition === PositionEnum.LEFT
      ? 0
      : subMenuSourcePosition === PositionEnum.CENTER
      ? leftActions.length + leftBlankCount
      : leftActions.length + leftBlankCount + centerItems.length + rightBlankCount;
  const offsetsToAdd = offsetsToAddFromPreviousSections + subMenuSourceIdx;
  const offsetsToSubtract = Math.floor(subMenu?.length / 2);
  const offsetCnt = offsetsToAdd - offsetsToSubtract;

  const minSideOffset = sidePadding / 2 + MENU_ITEM_WIDTH / 2;
  const offset = offsetCnt * MENU_ITEM_WIDTH + minSideOffset;

  const offsetOverflows = offset < 0 || offset + subMenu.length * MENU_ITEM_WIDTH > windowWidth;
  if (offsetOverflows) {
    return offset <= 0
      ? minSideOffset
      : windowWidth - subMenu?.length * MENU_ITEM_WIDTH - minSideOffset;
  }
  return offset;
};

const Menu = <T,>({
  activeKeys = [],
  items = [],
  subMenuItems = [],
  subMenuSource
}: MenuPropsInterface<T>) => {
  const ref = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth - 20);
  useResize(ref, () => setWindowWidth(window.innerWidth - 20));

  const leftItems: MenuItemInterface<T>[] = items.filter((i) => i.position === PositionEnum.LEFT);

  const rightItems: MenuItemInterface<T>[] = items.filter((i) => i.position === PositionEnum.RIGHT);

  const centerItems: MenuItemInterface<T>[] = items.filter(
    (i) => i.position === PositionEnum.CENTER
  );

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

    if (tmp_leftBlankCount % 1 !== 0 || tmp_rightBlankCount % 1 !== 0) {
      tmp_leftBlankCount = Math.floor(tmp_leftBlankCount);
      tmp_rightBlankCount = Math.ceil(tmp_rightBlankCount);
    }

    return [tmp_sidePadding, tmp_leftBlankCount, tmp_rightBlankCount];
  }, [leftItems, centerItems, rightItems, windowWidth]);

  const subMenuSourcePosition =
    [...leftItems, ...rightItems, ...centerItems].find(({key}) => key === subMenuSource)
      ?.position || null;
  const findFn = (items: MenuItemInterface<T>[], searchKey: T) =>
    items.findIndex(({key}) => key === searchKey);
  const subMenuSourceIdx =
    subMenuSource && subMenuSourcePosition
      ? findFn(
          subMenuSourcePosition === PositionEnum.LEFT
            ? leftItems
            : subMenuSourcePosition === PositionEnum.RIGHT
            ? rightItems
            : centerItems,
          subMenuSource
        )
      : null;
  const subMenuLeftOffset = useMemo(
    () =>
      calculateSubMenuLeftOffset(
        subMenuItems,
        leftItems,
        centerItems,
        rightItems,
        leftBlankCount,
        rightBlankCount,
        subMenuSourcePosition,
        subMenuSourceIdx,
        sidePadding,
        windowWidth
      ),
    [
      centerItems,
      leftBlankCount,
      leftItems,
      rightBlankCount,
      rightItems,
      sidePadding,
      subMenuItems,
      subMenuSourceIdx,
      subMenuSourcePosition,
      windowWidth
    ]
  );

  const visualizeSection = (items: MenuItemInterface<T>[]) => (
    <>
      {items.map((action, index) => (
        <Hexagon
          key={index}
          type="menu"
          iconName={action.iconName}
          imageSrc={action.imageSrc}
          indicator={action.iconIndicator}
          tooltip={action.tooltip || null}
          isActive={activeKeys.includes(action.key)}
          isDisabled={action.isDisabled}
          onClick={() => {
            action.onClick?.(action.key, action.viewPosition || action.position);
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
        <Hexagon key={`blank_${i}`} type="blank-small" margin={BLANK_MARGIN} />
      ))}

      {visualizeSection(centerItems)}

      {new Array(rightBlankCount).fill(null).map((_, i) => (
        <Hexagon
          key={`blank_${i + (leftBlankCount || 0)}`}
          type="blank-small"
          margin={BLANK_MARGIN}
        />
      ))}

      {visualizeSection(rightItems)}

      {subMenuSource && subMenuItems?.length && (
        <styled.SubMenuItemsContainer style={{left: `${subMenuLeftOffset}px`}}>
          {visualizeSection(subMenuItems)}
        </styled.SubMenuItemsContainer>
      )}
    </styled.Container>
  );
};

export default Menu;
