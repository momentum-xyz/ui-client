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

export const Right = Template.bind({});
Right.args = {
  text: 'Lorem ipsum'
};

export const RightOverflow = Template.bind({});
RightOverflow.args = {
  text: 'Lorem ipsum dolor sit amet.'
};
RightOverflow.decorators = [
  () => {
    return (
      <div style={{marginTop: '50px', marginLeft: 'calc(100% - 200px)'}}>
        <Tooltip {...RightOverflow.args}>
          <div style={{width: '100px', background: 'black', textAlign: 'center', color: 'white'}}>
            Hover me
          </div>
        </Tooltip>
      </div>
    );
  }
];

export const Left = Template.bind({});
Left.args = {
  text: 'Lorem ipsum',
  placement: 'left'
};
Left.decorators = [
  () => {
    return (
      <div style={{marginTop: '50px', marginLeft: '100px'}}>
        <Tooltip {...Left.args}>
          <div style={{width: '100px', background: 'black', textAlign: 'center', color: 'white'}}>
            Hover me
          </div>
        </Tooltip>
      </div>
    );
  }
];

export const LeftOverflow = Template.bind({});
LeftOverflow.args = {
  text: 'Lorem ipsum dolor sit amet.',
  placement: 'left'
};
LeftOverflow.decorators = [
  () => {
    return (
      <div style={{marginTop: '50px', marginLeft: '100px'}}>
        <Tooltip {...LeftOverflow.args}>
          <div style={{width: '100px', background: 'black', textAlign: 'center', color: 'white'}}>
            Hover me
          </div>
        </Tooltip>
      </div>
    );
  }
];
