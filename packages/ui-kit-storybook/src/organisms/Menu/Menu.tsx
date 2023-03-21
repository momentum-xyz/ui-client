import {FC, memo, useEffect, useRef, useState} from 'react';

import {IconNameType} from '../../types';
import {Hexagon} from '../../atoms';
import {useResize} from '../../hooks';

import * as styled from './Menu.styled';

const MENU_ITEM_WIDTH = 60;

export interface MenuItemInterface {
  id: number; // Maybe change this

  imageSrc?: string;
  iconName?: IconNameType;
  tooltip?: string;
}

export interface MenuPropsInterface {
  leftActions: MenuItemInterface[];
  centerActions: MenuItemInterface[];
  rightActions: MenuItemInterface[];

  activeMenuItemId: number;
  onMenuItemSelection: (id: number) => void;
}

const Menu: FC<MenuPropsInterface> = ({
  leftActions,
  centerActions,
  rightActions,
  activeMenuItemId,
  onMenuItemSelection
}) => {
  const [sidePadding, setSidePadding] = useState<number>(0);
  const [leftBlankCount, setLeftBlankCount] = useState<number>(1);
  const [rightBlankCount, setRightBlankCount] = useState<number>(1);

  const ref = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useResize(ref, () => setWindowWidth(window.innerWidth));

  useEffect(() => {
    const totalPossibleHexagons = Math.floor(windowWidth / MENU_ITEM_WIDTH);
    const tmp_sidePadding = windowWidth - totalPossibleHexagons * MENU_ITEM_WIDTH;

    const nonCentralHexagons = totalPossibleHexagons - centerActions.length;

    let tmp_leftBlankCount = nonCentralHexagons / 2 - leftActions.length;
    let tmp_rightBlankCount = nonCentralHexagons / 2 - rightActions.length;

    tmp_leftBlankCount = tmp_leftBlankCount > 0 ? tmp_leftBlankCount : 1;
    tmp_rightBlankCount = tmp_rightBlankCount > 0 ? tmp_rightBlankCount : 1;

    if (tmp_leftBlankCount % 1 !== 0) {
      tmp_leftBlankCount = Math.floor(tmp_leftBlankCount);
      tmp_rightBlankCount = Math.ceil(tmp_rightBlankCount);
    }

    if (tmp_sidePadding !== sidePadding) {
      setSidePadding(tmp_sidePadding);
    }
    if (tmp_leftBlankCount !== leftBlankCount) {
      setLeftBlankCount(tmp_leftBlankCount);
    }
    if (tmp_rightBlankCount !== rightBlankCount) {
      setRightBlankCount(tmp_rightBlankCount);
    }
  }, [leftActions, centerActions, rightActions, windowWidth]);

  const visualizeSection = (items: MenuItemInterface[]) => (
    <>
      {items.map((action) => (
        <Hexagon
          key={action.id}
          type="primary"
          iconName={action.iconName}
          imageSrc={action.imageSrc}
          isActive={action.id === activeMenuItemId}
          onClick={() => onMenuItemSelection(action.id)}
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
      {visualizeSection(leftActions)}
      {new Array(leftBlankCount).fill(null).map((_, i) => (
        <Hexagon key={`blank_${i}`} type="blank" margin={12} />
      ))}
      {visualizeSection(centerActions)}
      {new Array(rightBlankCount).fill(null).map((_, i) => (
        <Hexagon key={`blank_${i + (leftBlankCount || 0)}`} type="blank" margin={12} />
      ))}
      {visualizeSection(rightActions)}
    </styled.Container>
  );
};

export default memo(Menu);
