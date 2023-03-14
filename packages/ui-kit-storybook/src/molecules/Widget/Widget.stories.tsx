import {ComponentMeta, Story} from '@storybook/react';

import Widget, {WidgetPropsInterface} from './Widget';

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
  hexagon: <div />
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
  hexagon: <div />,
  wide: true
};
