import {ComponentMeta, Story} from '@storybook/react';

import {Frame, Image} from '../../atoms';
import {GlobalStyles} from '../../styles-global.styled';

import Panel, {PanelPropsInterface} from './Panel';

const IMAGE_SRC = 'https://picsum.photos/500';

const TEXT_COMPONENT = (
  <div>
    A non-fungible token (NFT) is a unique digital identifier that is recorded on a blockchain, and
    is used to certify ownership and authenticity. It cannot be copied, substituted, or
    subdivided.[1] The ownership of an NFT is recorded in the blockchain and can be transferred by
    the owner, allowing NFTs to be sold and traded. NFTs can be created by anybody, and require few
    or no coding skills to create.[2] NFTs typically contain references to digital files such as
    artworks, photos, videos, and audio. Because NFTs are uniquely identifiable, they differ from
    cryptocurrencies, which are fungible. Proponents claim that NFTs provide a public certificate of
    authenticity or proof of ownership, but the legal rights conveyed by an NFT can be uncertain.
    The ownership of an NFT as defined by the blockchain has no inherent legal meaning and does not
    necessarily grant copyright, intellectual property rights, or other legal rights over its
    associated digital file. An NFT does not restrict the sharing or copying of its associated
    digital file and does not prevent the creation of NFTs that reference identical files. A
    non-fungible token (NFT) is a unique digital identifier that is recorded on a blockchain, and is
    used to certify ownership and authenticity. It cannot be copied, substituted, or subdivided.[1]
    The ownership of an NFT is recorded in the blockchain and can be transferred by the owner,
    allowing NFTs to be sold and traded. NFTs can be created by anybody, and require few or no
    coding skills to create.[2] NFTs typically contain references to digital files such as artworks,
    photos, videos, and audio. Because NFTs are uniquely identifiable, they differ from
    cryptocurrencies, which are fungible. Proponents claim that NFTs provide a public certificate of
    authenticity or proof of ownership, but the legal rights conveyed by an NFT can be uncertain.
    The ownership of an NFT as defined by the blockchain has no inherent legal meaning and does not
    necessarily grant copyright, intellectual property rights, or other legal rights over its
    associated digital file. An NFT does not restrict the sharing or copying of its associated
    digital file and does not prevent the creation of NFTs that reference identical files.
  </div>
);

export default {
  title: 'Molecules/Panel',
  component: Panel,
  argTypes: {
    opts: {
      children: {
        disable: true
      }
    }
  },
  decorators: [
    (Story) => (
      <>
        <GlobalStyles />
        <Story />
      </>
    )
  ]
} as ComponentMeta<typeof Panel>;

const Template: Story<PanelPropsInterface> = (args) => {
  return <Panel {...args} title="Long title of sidebar" icon="rabbit_fill" />;
};

export const Primary = Template.bind({});
Primary.args = {
  size: 'normal'
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Connected',
  variant: 'secondary'
};

export const Normal = Template.bind({});
Normal.args = {};

export const Large = Template.bind({});
Large.args = {
  size: 'large'
};

export const Wide = Template.bind({});
Wide.args = {
  size: 'wide'
};

export const FullHeight = Template.bind({});
FullHeight.args = {
  isFullHeight: true
};

export const WithText = Template.bind({});
WithText.args = {
  isFullHeight: true,
  children: TEXT_COMPONENT
};

export const WithTopComponent = Template.bind({});
WithTopComponent.args = {
  isFullHeight: true,
  children: <div style={{padding: '0 10px 10px 10px'}}>{TEXT_COMPONENT}</div>,
  topComponent: (
    <div style={{padding: '10px 10px 0 10px'}}>
      <Frame>
        <Image height={160} src={IMAGE_SRC} />
      </Frame>
    </div>
  )
};

export const WithBottomComponent = Template.bind({});
WithBottomComponent.args = {
  isFullHeight: true,
  children: <div style={{padding: '0 10px'}}>{TEXT_COMPONENT}</div>,
  bottomComponent: (
    <div style={{padding: '10px'}}>
      <Frame>
        <Image height={160} src={IMAGE_SRC} />
      </Frame>
    </div>
  )
};
