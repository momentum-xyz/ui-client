import CarouselComponent from 'react-multi-carousel';

import * as styled from './Slider.styled';

export interface SliderItemInterface<T> {
  id: T;
  name: string;
  image: string;
}

export interface SliderPropsInterface<T> {
  items: SliderItemInterface<T>[];
  onClick: (id: T) => void;
}

const Slider = <T,>({items, onClick}: SliderPropsInterface<T>) => {
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
            <styled.ItemImage src={item.image} />
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
