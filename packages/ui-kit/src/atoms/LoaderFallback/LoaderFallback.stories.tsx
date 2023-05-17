import {Meta, Story} from '@storybook/react';

import LoaderFallback, {LoaderFallbackPropsInterface} from './LoaderFallback';

export default {
  title: 'Atoms/LoaderFallback',
  component: LoaderFallback
} as Meta;

const Template: Story<LoaderFallbackPropsInterface> = (args) => <LoaderFallback {...args} />;

export const General = Template.bind({});
General.args = {
  text: 'React is loading...'
};
