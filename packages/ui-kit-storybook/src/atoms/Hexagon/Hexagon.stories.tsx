import {Meta, Story} from '@storybook/react';

import Hexagon, {HexagonPropsInterface} from './Hexagon';

export default {
  title: 'Atoms/Hexagon',
  component: Hexagon
} as Meta;

const Template: Story<HexagonPropsInterface> = (args) => <Hexagon {...args} />;

export const General = Template.bind({});
General.args = {};
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

export const Primary = Template.bind({});
Primary.args = {};
Primary.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(Primary.args as HexagonPropsInterface)}>
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

export const PrimaryNoHover = Template.bind({});
PrimaryNoHover.args = {
  noHover: true
};
PrimaryNoHover.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(PrimaryNoHover.args as HexagonPropsInterface)}>
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

export const PrimaryActive = Template.bind({});
PrimaryActive.args = {
  isActive: true
};
PrimaryActive.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(PrimaryActive.args as HexagonPropsInterface)}>
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

export const PrimaryBorderless = Template.bind({});
PrimaryBorderless.args = {
  noBorder: true
};
PrimaryBorderless.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(PrimaryBorderless.args as HexagonPropsInterface)}>
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

export const LargeSecondary = Template.bind({});
LargeSecondary.args = {
  type: 'secondary-large'
};
LargeSecondary.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(LargeSecondary.args as HexagonPropsInterface)}>
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

export const LargeSecondaryBorderless = Template.bind({});
LargeSecondaryBorderless.args = {
  noBorder: true,
  type: 'secondary-large'
};
LargeSecondaryBorderless.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(LargeSecondaryBorderless.args as HexagonPropsInterface)}>
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

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary'
};
Secondary.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(Secondary.args as HexagonPropsInterface)}>
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

export const SecondaryNoHover = Template.bind({});
SecondaryNoHover.args = {
  noHover: true,
  type: 'secondary'
};
SecondaryNoHover.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(SecondaryNoHover.args as HexagonPropsInterface)}>
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

export const SecondaryBorderless = Template.bind({});
SecondaryBorderless.args = {
  noBorder: true,
  type: 'secondary'
};
SecondaryBorderless.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(SecondaryBorderless.args as HexagonPropsInterface)}>
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

export const SecondarySmall = Template.bind({});
SecondarySmall.args = {
  type: 'secondary-small'
};
SecondarySmall.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(SecondarySmall.args as HexagonPropsInterface)}>
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

export const SecondarySmallBorderless = Template.bind({});
SecondarySmallBorderless.args = {
  noBorder: true,
  type: 'secondary-small'
};
SecondarySmallBorderless.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(SecondarySmallBorderless.args as HexagonPropsInterface)}>
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
  type: 'blank',
  margin: 12
};
Blank.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
      </div>
    );
  }
];

export const BlankBorderless = Template.bind({});
BlankBorderless.args = {
  noBorder: true,
  type: 'blank',
  margin: 12
};
BlankBorderless.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5'}}>
        <Hexagon {...(BlankBorderless.args as HexagonPropsInterface)} />
      </div>
    );
  }
];

export const PrimaryRow = Template.bind({});
PrimaryRow.args = {};
PrimaryRow.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5', display: 'flex'}}>
        <Hexagon {...(PrimaryRow.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
        <Hexagon {...(PrimaryRow.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
        <Hexagon {...(PrimaryRow.args as HexagonPropsInterface)}>
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
export const PrimaryRowWithBlanks = Template.bind({});
PrimaryRowWithBlanks.args = {};
PrimaryRowWithBlanks.decorators = [
  () => {
    return (
      <div style={{padding: '10px', background: '#ead6e5', display: 'flex', alignItems: 'center'}}>
        <Hexagon {...(PrimaryRowWithBlanks.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
        <Hexagon {...(PrimaryRowWithBlanks.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
        <Hexagon {...(PrimaryRowWithBlanks.args as HexagonPropsInterface)}>
          <img
            src="https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg"
            alt="jetsons"
            style={{height: '100%'}}
          />
        </Hexagon>
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
      </div>
    );
  }
];
