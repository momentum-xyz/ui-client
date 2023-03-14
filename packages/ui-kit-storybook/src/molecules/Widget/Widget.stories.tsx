import {ComponentMeta, Story} from '@storybook/react';

import {Hexagon} from '../../atoms';

import Widget, {WidgetPropsInterface} from './Widget';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/Widget',
  component: Widget,
  argTypes: {
    hexagon: {
      table: {
        disable: true
      }
    }
  }
} as ComponentMeta<typeof Widget>;

const Template: Story<WidgetPropsInterface> = (args) => {
  return <Widget {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  title: 'Long title of sidebar',
  variant: 'primary',
  hexagon: (
    <Hexagon type="secondary-borderless">
      <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
    </Hexagon>
  )
};

export const Secondary = Template.bind({});
Secondary.args = {
  title: 'Long odyssey name',
  label: 'Connected',
  variant: 'secondary',
  hexagon: <div />
};

export const Wide = Template.bind({});
Wide.args = {
  variant: 'primary',
  title: 'Title of sidebar',
  hexagon: (
    <Hexagon type="secondary-borderless">
      <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
    </Hexagon>
  ),
  wide: true
};
