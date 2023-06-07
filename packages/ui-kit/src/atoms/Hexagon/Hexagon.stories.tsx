import {Meta, Story} from '@storybook/react';

import Hexagon, {HexagonPropsInterface} from './Hexagon';

export default {
  title: 'Atoms/Hexagon',
  component: Hexagon
} as Meta;

const IMAGE_SRC = 'https://picsum.photos/300';

const Template: Story<HexagonPropsInterface> = (args) => {
  const allArgs = {...args};
  if (!allArgs.iconName && !allArgs.imageSrc && !allArgs.label) {
    allArgs.imageSrc = IMAGE_SRC;
  }
  return <Hexagon {...allArgs} />;
};

export const Menu = Template.bind({});
Menu.args = {
  type: 'menu',
  iconName: 'fly-portal'
};

export const MenuActive = Template.bind({});
MenuActive.args = {
  type: 'menu',
  iconName: 'fly-portal',
  isActive: true
};

export const MenuIndicator = Template.bind({});
MenuIndicator.args = {
  type: 'menu',
  indicator: 'voice'
};

export const MenuTooltip = Template.bind({});
MenuTooltip.args = {
  type: 'menu',
  tooltip: 'Lorem ipsum',
  iconName: 'fly-portal'
};
MenuTooltip.decorators = [
  () => {
    return (
      <div style={{marginTop: '100px'}}>
        <Hexagon {...(MenuTooltip.args as HexagonPropsInterface)} />
      </div>
    );
  }
];

export const MenuWithText = Template.bind({});
MenuWithText.args = {type: 'menu', label: '+90'};

export const MenuBlank = Template.bind({});
MenuBlank.args = {type: 'blank-small'};

export const MenuImageDisabled = Template.bind({});
MenuImageDisabled.args = {
  type: 'menu',
  imageSrc: IMAGE_SRC,
  isDisabled: true
};

export const MenuDisabled = Template.bind({});
MenuDisabled.args = {
  type: 'menu',
  isDisabled: true,
  iconName: 'astronaut'
};

export const Primary = Template.bind({});
Primary.args = {};

export const PrimaryWithIcon = Template.bind({});
PrimaryWithIcon.args = {iconName: 'fly-portal'};

export const PrimaryNoHover = Template.bind({});
PrimaryNoHover.args = {
  noHover: true
};

export const PrimaryActive = Template.bind({});
PrimaryActive.args = {
  isActive: true
};

export const PrimaryWithIconActive = Template.bind({});
PrimaryWithIconActive.args = {
  iconName: 'fly-portal',
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
export const SecondaryWithWrongImageUrl = Template.bind({});
SecondaryWithWrongImageUrl.args = {
  type: 'secondary',
  imageSrc: 'https://some.wrong.url'
};
export const SecondaryWithIcon = Template.bind({});
SecondaryWithIcon.args = {type: 'secondary', iconName: 'fly-portal'};

export const SecondaryWithIconSuccess = Template.bind({});
SecondaryWithIconSuccess.args = {type: 'secondary', iconName: 'fly-portal', color: 'success'};

export const SecondaryWithIconDanger = Template.bind({});
SecondaryWithIconDanger.args = {type: 'secondary', iconName: 'fly-portal', color: 'danger'};

export const TransparentSecondaryWithIcon = Template.bind({});
TransparentSecondaryWithIcon.args = {
  type: 'secondary',
  transparentBackground: true,
  iconName: 'fly-portal'
};

export const TransparentSecondaryWithIconSuccess = Template.bind({});
TransparentSecondaryWithIconSuccess.args = {
  type: 'secondary',
  transparentBackground: true,
  iconName: 'fly-portal',
  color: 'success'
};

export const TransparentSecondaryWithIconDanger = Template.bind({});
TransparentSecondaryWithIconDanger.args = {
  type: 'secondary',
  transparentBackground: true,
  iconName: 'fly-portal',
  color: 'danger'
};

export const SecondaryBorderless = Template.bind({});
SecondaryBorderless.args = {
  type: 'secondary-borderless'
};

export const Third = Template.bind({});
Third.args = {
  type: 'third'
};
export const ThirdWithIcon = Template.bind({});
ThirdWithIcon.args = {type: 'third', iconName: 'fly-portal'};

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

export const FourthWithIcon = Template.bind({});
FourthWithIcon.args = {type: 'fourth', iconName: 'fly-portal'};

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
