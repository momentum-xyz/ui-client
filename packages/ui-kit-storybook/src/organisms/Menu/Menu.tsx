import {FC, memo, useEffect, useRef, useState} from 'react';

import {IconNameType} from '../../types';
import {Hexagon} from '../../atoms';
import {useResize} from '../../hooks';

import * as styled from './Menu.styled';

const MENU_ITEM_WIDTH = 60;

interface MenuItemInterface {
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
  const [sidePadding, setSidePadding] = useState<number | null>(null);
  const [leftBlankCount, setLeftBlankCount] = useState<number | null>(null);
  const [rightBlankCount, setRightBlankCount] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useResize(ref, () => setWindowWidth(window.innerWidth));

  useEffect(() => {
    // // const windowWidth = window.innerWidth

    // const sideActionCnt = leftActions.length + rightActions.length;
    // const allActionCnt = sideActionCnt + centerActions.length;
    // const allActionsWidth = allActionCnt * MENU_ITEM_WIDTH;

    // const blankSpace = windowWidth - allActionsWidth;
    // const blankCount = Math.floor(blankSpace / MENU_ITEM_WIDTH);
    // const tmp_sidePadding = blankSpace - blankCount * MENU_ITEM_WIDTH;

    // console.log(
    //   `We need to add ${blankCount} blanks, the side padding should be ${tmp_sidePadding / 2}px`
    // );

    // const leftBlankPercent = leftActions.length / (sideActionCnt / 100);
    // const rightBlankPercent = rightActions.length / (sideActionCnt / 100);

    // const tmp_leftBlankCount = Math.round((blankCount / 100) * rightBlankPercent);
    // const tmp_rightBlankCount = Math.round((blankCount / 100) * leftBlankPercent);

    // console.log(
    //   `Blank spread - left: ${tmp_leftBlankCount} (${leftBlankPercent}%), right: ${tmp_rightBlankCount} (${rightBlankPercent}%)`
    // );

    const leftActionsSize = leftActions.length * MENU_ITEM_WIDTH;
    const rightActionsSize = rightActions.length * MENU_ITEM_WIDTH;
    const centerActionsSize = centerActions.length * MENU_ITEM_WIDTH;
    const leftSideSpace = windowWidth / 2 - leftActionsSize - centerActionsSize / 2;
    const rightSideSpace = windowWidth / 2 - rightActionsSize - centerActionsSize / 2;

    let tmp_leftBlankCount = Math.floor(leftSideSpace / MENU_ITEM_WIDTH);
    let tmp_rightBlankCount = Math.floor(rightSideSpace / MENU_ITEM_WIDTH);

    tmp_leftBlankCount = tmp_leftBlankCount > 0 ? tmp_leftBlankCount : 1;
    tmp_rightBlankCount = tmp_rightBlankCount > 0 ? tmp_rightBlankCount : 1;

    const tmp_sidePadding =
      leftSideSpace -
      tmp_leftBlankCount * MENU_ITEM_WIDTH +
      (rightSideSpace - tmp_rightBlankCount * MENU_ITEM_WIDTH);

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
