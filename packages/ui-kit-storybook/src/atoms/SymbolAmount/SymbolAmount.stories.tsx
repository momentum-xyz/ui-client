import {ComponentMeta, Story} from '@storybook/react';

import SymbolAmount, {SymbolAmountPropsInterface} from './SymbolAmount';

export default {
  title: 'Atoms/SymbolAmount',
  component: SymbolAmount,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SymbolAmount>;

const Template: Story<SymbolAmountPropsInterface> = (args) => {
  return <SymbolAmount {...args} />;
};

export const General = Template.bind({});
General.args = {
  value: 10.563,
  tokenSymbol: 'MOM'
};
