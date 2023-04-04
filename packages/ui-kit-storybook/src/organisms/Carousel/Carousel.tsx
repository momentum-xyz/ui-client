import CarouselComponent from 'react-multi-carousel';

import * as styled from './Carousel.styled';

export interface CarouselItemInterface<T> {
  id: T;
  name: string;
  image: string;
}

export interface CarouselPropsInterface<T> {
  items: CarouselItemInterface<T>[];
  onClick: (id: T) => void;
}

const Carousel = <T,>({items, onClick}: CarouselPropsInterface<T>) => {
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
            <styled.ItemImage src={item.image} />
            <styled.ItemName>{item.name}</styled.ItemName>
          </styled.ItemLink>
        ))}
      </CarouselComponent>
    </styled.Container>
  );
};

export default Carousel;
