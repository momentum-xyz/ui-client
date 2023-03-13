import {Meta, Story} from '@storybook/react';

import Hexagon, {HexagonPropsInterface} from './Hexagon';

export default {
  title: 'Atoms/Hexagon',
  component: Hexagon
} as Meta;

const IMAGE_SRC = 'https://picsum.photos/300';

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
  type: 'primary-borderless'
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary'
};

export const SecondaryBorderless = Template.bind({});
SecondaryBorderless.args = {
  type: 'secondary-borderless'
};

export const Third = Template.bind({});
Third.args = {
  type: 'third'
};

export const ThirdNoHover = Template.bind({});
ThirdNoHover.args = {
  noHover: true,
  type: 'third'
};

export const ThirdBorderless = Template.bind({});
ThirdBorderless.args = {
  type: 'third-borderless'
};

export const Fourth = Template.bind({});
Fourth.args = {
  type: 'fourth'
};

export const FourthBorderless = Template.bind({});
FourthBorderless.args = {
  type: 'fourth-borderless'
};

export const Blank = Template.bind({});
Blank.args = {
  type: 'blank',
  margin: 12
};

export const BlankBorderless = Template.bind({});
BlankBorderless.args = {
  type: 'blank-borderless',
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
