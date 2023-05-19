import {ComponentMeta, Story} from '@storybook/react';

import Tooltip, {TooltipPropsInterface} from './Tooltip';

export default {
  title: 'Atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>;

const Template: Story<TooltipPropsInterface> = (args) => {
  return (
    <div style={{marginTop: '50px'}}>
      <Tooltip {...args}>
        <div style={{width: '100px', background: 'black', textAlign: 'center', color: 'white'}}>
          Hover me
        </div>
      </Tooltip>
    </div>
  );
};

export const General = Template.bind({});
General.args = {
  text: 'Lorem ipsum'
};

export const GeneralOverflow = Template.bind({});
GeneralOverflow.args = {
  text: 'Lorem ipsum dolor sit amet.'
};
GeneralOverflow.decorators = [
  () => {
    return (
      <div style={{marginTop: '50px', marginLeft: 'calc(100% - 200px)'}}>
        <Tooltip {...GeneralOverflow.args}>
          <div style={{width: '100px', background: 'black', textAlign: 'center', color: 'white'}}>
            Hover me
          </div>
        </Tooltip>
      </div>
    );
  }
];
