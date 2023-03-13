import {ComponentMeta, Story} from '@storybook/react';

import Tooltip, {TooltipPropsInterface} from './Tooltip';

export default {
  title: 'Atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>;

const Template: Story<TooltipPropsInterface> = (args) => {
  return (
    <div style={{marginTop: '50px', marginLeft: '100px'}}>
      <Tooltip {...args}>
        <div style={{width: '200px', background: 'black', textAlign: 'center', color: 'white'}}>
          Hover me
        </div>
      </Tooltip>
    </div>
  );
};

export const GoingRight = Template.bind({});
GoingRight.args = {
  text: 'Lorem ipsum'
};

export const GoingLeft = Template.bind({});
GoingLeft.args = {
  text: 'Lorem ipsum',
  placement: 'left'
};
