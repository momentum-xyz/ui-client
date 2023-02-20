import {Meta, Story} from '@storybook/react';

import Hexagon, {HexagonPropsInterface} from './Hexagon';

export default {
  title: 'Atoms/Hexagon',
  component: Hexagon
} as Meta;

const Template: Story<HexagonPropsInterface> = (args) => <Hexagon {...args} />;

export const General = Template.bind({});
General.args = {
  size: 'large',
  isBordered: true,
  isBlueBorder: true
};
General.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(General.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
      </div>
    );
  }
];

export const Small = Template.bind({});
Small.args = {
  size: 'small'
};
Small.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(Small.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
      </div>
    );
  }
];

export const Large = Template.bind({});
Large.args = {
  size: 'large'
};
Large.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(Large.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
      </div>
    );
  }
];

export const Blank = Template.bind({});
Blank.args = {
  isBlank: true
};
Blank.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(Blank.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
      </div>
    );
  }
];

export const BlueBorder = Template.bind({});
BlueBorder.args = {
  isBlueBorder: true
};
BlueBorder.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(BlueBorder.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
      </div>
    );
  }
];

export const Bordered = Template.bind({});
Bordered.args = {
  isBordered: true
};
Bordered.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(Bordered.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
      </div>
    );
  }
];
