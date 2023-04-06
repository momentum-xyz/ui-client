import {ComponentMeta, Story} from '@storybook/react';

import Carousel, {CarouselPropsInterface} from './Carousel';

export default {
  title: 'Organisms/Carousel',
  component: Carousel,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Carousel>;

const Template: Story<CarouselPropsInterface<string>> = (args) => {
  return <Carousel height={180} {...args} />;
};

export const General = Template.bind({});
General.args = {
  items: [
    {id: '1', name: 'Odyssey name 1', image: 'https://picsum.photos/501'},
    {id: '2', name: 'Odyssey name 2', image: 'https://picsum.photos/502'},
    {id: '3', name: 'Odyssey name 3', image: 'https://picsum.photos/503'},
    {id: '4', name: 'Odyssey name 4', image: 'https://picsum.photos/504'},
    {id: '5', name: 'Odyssey name 5', image: 'https://picsum.photos/505'}
  ],
  onClick: (id: string) => console.log(id)
};
