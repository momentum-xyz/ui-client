import {IconSvg} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './Carousel.styled';

export interface PropsInterface<T> {
  items: T[];
  activeItem: T;
  onChange: (item: T) => void;
  windowSize?: number;
  renderItem: (item: T, index: number) => JSX.Element;
}

export const Carousel = <T extends object>({
  items,
  activeItem,
  windowSize = 5,
  onChange,
  renderItem
}: PropsInterface<T>): JSX.Element => {
  // we need a slice of items with the active item in the middle
  const longItems = [...items, ...items, ...items];
  const activeIdx = items.findIndex((item) => item === activeItem) + items.length;

  const realWindowSize = Math.min(windowSize, items.length);
  const halfSize = Math.floor(realWindowSize / 2);
  const windowItems = longItems.slice(activeIdx - halfSize, activeIdx + halfSize + 1);

  return (
    <styled.Container>
      <styled.ButtonHolder
        style={{transform: 'scaleX(-1)'}}
        onClick={() => onChange(longItems[activeIdx - 1])}
      >
        <IconSvg name="arrow" size="xxl" />
      </styled.ButtonHolder>
      {windowItems.map(renderItem)}
      <styled.ButtonHolder onClick={() => onChange(longItems[activeIdx + 1])}>
        <IconSvg name="arrow" size="xxl" />
      </styled.ButtonHolder>
    </styled.Container>
  );
};
