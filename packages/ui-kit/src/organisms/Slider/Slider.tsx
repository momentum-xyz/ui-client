import CarouselComponent from 'react-multi-carousel';

import {Image} from '../../atoms/Image';
import {IconNameType} from '../../types';

import * as styled from './Slider.styled';

export interface SliderItemInterface<T> {
  id: T;
  name: string;
  image: string;
}

export interface SliderPropsInterface<T> {
  items: SliderItemInterface<T>[];
  height?: number;
  errorIcon?: IconNameType;
  errorIconOffset?: number;
  onClick: (id: T) => void;
}

const Slider = <T,>({
  items,
  height,
  errorIcon,
  errorIconOffset = 15,
  onClick
}: SliderPropsInterface<T>) => {
  return (
    <styled.Container data-testid="Slider-test">
      <CarouselComponent
        infinite
        showDots={false}
        arrows
        slidesToSlide={1}
        centerMode={false}
        responsive={{
          desktop: {
            breakpoint: {max: 4000, min: 0},
            slidesToSlide: 1,
            items: 3
          }
        }}
      >
        {items.map((item) => (
          <styled.ItemLink key={`${item.id}`} onClick={() => onClick(item.id)}>
            <Image
              height={height}
              src={item.image}
              errorIcon={errorIcon}
              errorIconOffset={errorIconOffset}
              isIconAccent
            />
            <styled.ItemName>
              <span>{item.name}</span>
            </styled.ItemName>
          </styled.ItemLink>
        ))}
      </CarouselComponent>
    </styled.Container>
  );
};

export default Slider;
