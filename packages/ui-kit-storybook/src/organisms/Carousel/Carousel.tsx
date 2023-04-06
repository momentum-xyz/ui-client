import CarouselComponent from 'react-multi-carousel';

import {Image} from '../../atoms/Image';

import * as styled from './Carousel.styled';

export interface CarouselItemInterface<T> {
  id: T;
  name: string;
  image: string;
}

export interface CarouselPropsInterface<T> {
  items: CarouselItemInterface<T>[];
  height?: number;
  onClick: (id: T) => void;
}

const Carousel = <T,>({items, height, onClick}: CarouselPropsInterface<T>) => {
  return (
    <styled.Container data-testid="Carousel-test">
      <CarouselComponent
        infinite
        showDots
        arrows={false}
        responsive={{
          desktop: {
            breakpoint: {max: 4000, min: 0},
            slidesToSlide: 1,
            items: 1
          }
        }}
      >
        {items.map((item) => (
          <styled.ItemLink key={`${item.id}`} onClick={() => onClick(item.id)}>
            <Image height={height} src={item.image} />
            <styled.ItemName>{item.name}</styled.ItemName>
          </styled.ItemLink>
        ))}
      </CarouselComponent>
    </styled.Container>
  );
};

export default Carousel;
