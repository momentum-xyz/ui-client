import {Meta, Story} from '@storybook/react';

import Hexagon, {HexagonPropsInterface} from './Hexagon';

export default {
  title: 'Atoms/Hexagon',
  component: Hexagon
} as Meta;

const IMAGE_SRC =
  'https://global-uploads.webflow.com/600af1368b0b4075be07c984/632ad6edc4c62f89d965aca6_Jetsons-60th-Anniversary.jpg';

const Template: Story<HexagonPropsInterface> = (args) => (
  <Hexagon {...args}>
    <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
  </Hexagon>
);

export const Primary = Template.bind({});
Primary.args = {};

export const PrimaryNoHover = Template.bind({});
PrimaryNoHover.args = {
  noHover: true
};

export const PrimaryActive = Template.bind({});
PrimaryActive.args = {
  isActive: true
};

export const PrimaryBorderless = Template.bind({});
PrimaryBorderless.args = {
  noBorder: true
};

export const LargeSecondary = Template.bind({});
LargeSecondary.args = {
  type: 'secondary-large'
};

export const LargeSecondaryBorderless = Template.bind({});
LargeSecondaryBorderless.args = {
  noBorder: true,
  type: 'secondary-large'
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary'
};

export const SecondaryNoHover = Template.bind({});
SecondaryNoHover.args = {
  noHover: true,
  type: 'secondary'
};

export const SecondaryBorderless = Template.bind({});
SecondaryBorderless.args = {
  noBorder: true,
  type: 'secondary'
};

export const SecondarySmall = Template.bind({});
SecondarySmall.args = {
  type: 'secondary-small'
};

export const SecondarySmallBorderless = Template.bind({});
SecondarySmallBorderless.args = {
  noBorder: true,
  type: 'secondary-small'
};

export const Blank = Template.bind({});
Blank.args = {
  type: 'blank',
  margin: 12
};

export const BlankBorderless = Template.bind({});
BlankBorderless.args = {
  noBorder: true,
  type: 'blank',
  margin: 12
};

export const PrimaryRow = Template.bind({});
PrimaryRow.args = {};
PrimaryRow.decorators = [
  () => {
    return (
      <div className="storybook-grid">
        <Hexagon {...(PrimaryRow.args as HexagonPropsInterface)}>
          <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
        </Hexagon>
        <Hexagon {...(PrimaryRow.args as HexagonPropsInterface)}>
          <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
        </Hexagon>
        <Hexagon {...(PrimaryRow.args as HexagonPropsInterface)}>
          <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
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
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Hexagon {...(PrimaryRowWithBlanks.args as HexagonPropsInterface)}>
          <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
        </Hexagon>
        <Hexagon {...(PrimaryRowWithBlanks.args as HexagonPropsInterface)}>
          <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
        </Hexagon>
        <Hexagon {...(PrimaryRowWithBlanks.args as HexagonPropsInterface)}>
          <img src={IMAGE_SRC} alt="jetsons" style={{height: '100%'}} />
        </Hexagon>
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
        <Hexagon {...(Blank.args as HexagonPropsInterface)} />
      </div>
    );
  }
];
